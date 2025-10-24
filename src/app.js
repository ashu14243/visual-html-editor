const stage = document.getElementById('stage')
const importFile = document.getElementById('importFile')
const imgReplace = document.getElementById('imgReplace')
let selected = null
let dragging = null
let dx=0,dy=0

document.getElementById('btnImport').addEventListener('click',()=>importFile.click())
document.getElementById('btnExport').addEventListener('click',exportHTML)
document.getElementById('btnReplaceImg').addEventListener('click',()=>imgReplace.click())
document.getElementById('btnDelete').addEventListener('click',()=>{ if(selected) selected.remove(); selected=null})

importFile.addEventListener('change',e=>{
  const f=e.target.files[0]
  if(!f) return
  const r=new FileReader()
  r.onload=()=>importHTML(r.result)
  r.readAsText(f)
  e.target.value=''
})

imgReplace.addEventListener('change',e=>{
  const f=e.target.files[0]
  if(!f || !selected) return
  if(selected.tagName !== 'IMG') { e.target.value=''; return }
  const r=new FileReader()
  r.onload=()=>{ selected.src=r.result }
  r.readAsDataURL(f)
  e.target.value=''
})

function importHTML(text){
  const temp = document.createElement('div')
  temp.style.position='absolute'
  temp.style.left='-9999px'
  temp.innerHTML = text
  document.body.appendChild(temp)
  const children = Array.from(temp.children)
  const stageRect = stage.getBoundingClientRect()
  const maxStageWidth = Math.max(50, stage.clientWidth - 20)
  children.forEach(ch=>{
    ch.style.position='absolute'
    const rect = ch.getBoundingClientRect()
    const clone = ch.cloneNode(true)
    let width = rect.width || clone.offsetWidth || maxStageWidth
    let height = rect.height || clone.offsetHeight || 20
    if (width > maxStageWidth) {
      const scale = maxStageWidth / width
      width = Math.round(maxStageWidth)
      height = Math.round(height * scale)
    }
    let left = Math.round(rect.left - stageRect.left + stage.scrollLeft)
    let top = Math.round(rect.top - stageRect.top + stage.scrollTop)
    if (left < 0) left = 0
    if (top < 0) top = 0
    if (left + width > stage.scrollLeft + stage.clientWidth) {
      left = Math.max(0, stage.scrollLeft + stage.clientWidth - width)
    }
    clone.style.left = left + 'px'
    clone.style.top = top + 'px'
    clone.style.width = width + 'px'
    clone.style.height = height + 'px'
    clone.classList.add('draggable')
    makeInteractive(clone)
    stage.appendChild(clone)
  })
  temp.remove()
}

function makeInteractive(el){
  el.style.touchAction='none'
  el.style.maxWidth = '100%'
  el.style.wordBreak = 'break-word'
  el.style.overflowWrap = 'break-word'
  el.addEventListener('mousedown',startDrag)
  el.addEventListener('dblclick',e=>{
    if(el.tagName !== 'IMG') {
      el.contentEditable = "true"
      el.focus()
      const sel = window.getSelection()
      sel.collapse(el,0)
      el.addEventListener('blur',()=>{ el.contentEditable="false" },{once:true})
    }
  })
  el.addEventListener('click',e=>{
    e.stopPropagation()
    select(el)
  })
  const imgs = Array.from(el.querySelectorAll('img'))
  imgs.forEach(i=>i.style.pointerEvents='auto')
}

function select(el){
  if(selected) selected.classList.remove('selected')
  selected = el
  if(selected) selected.classList.add('selected')
}

stage.addEventListener('click',()=>{ if(selected){ selected.classList.remove('selected'); selected=null }})

function startDrag(e){
  e.preventDefault()
  dragging = e.currentTarget
  select(dragging)
  const rect = dragging.getBoundingClientRect()
  dx = e.clientX - rect.left
  dy = e.clientY - rect.top
  document.addEventListener('mousemove',onDrag)
  document.addEventListener('mouseup',endDrag,{once:true})
}

function onDrag(e){
  if(!dragging) return
  const stageRect = stage.getBoundingClientRect()
  let x = e.clientX - stageRect.left - dx + stage.scrollLeft
  let y = e.clientY - stageRect.top - dy + stage.scrollTop
  if(x<0) x=0
  if(y<0) y=0
  const maxX = stage.scrollLeft + stage.clientWidth - dragging.offsetWidth
  const maxY = stage.scrollTop + stage.clientHeight - dragging.offsetHeight
  if (x > maxX) x = maxX
  if (y > Math.max(0, maxY)) y = Math.max(0, maxY)
  dragging.style.left = x + 'px'
  dragging.style.top = y + 'px'
}

function endDrag(){
  dragging = null
  document.removeEventListener('mousemove',onDrag)
}

document.addEventListener('keydown',e=>{
  if(e.key === 'Delete' && selected) { selected.remove(); selected=null }
})

function exportHTML(){
  const clone = stage.cloneNode(true)
  const nodes = clone.querySelectorAll('.selected')
  nodes.forEach(n=>n.classList.remove('selected'))
  clone.style.minHeight = ''
  const html = '<!doctype html>\n<html>\n<head>\n<meta charset="utf-8">\n<title>export</title>\n</head>\n<body>\n' + clone.innerHTML + '\n</body>\n</html>'
  const blob = new Blob([html],{type:'text/html'})
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'export.html'
  document.body.appendChild(a)
  a.click()
  a.remove()
}