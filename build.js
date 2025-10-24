const fs = require('fs')
const path = require('path')
const root = process.cwd()
const out = path.join(root, 'dist')
try {
    if (fs.existsSync(out)) {
        try { fs.rmSync(out, { recursive: true, force: true }) } catch(e) { /* ignore */ }
    }
    fs.mkdirSync(out, { recursive: true })
    function copy(src, dest) {
        const s = path.join(root, src)
        const d = path.join(out, dest)
        if (!fs.existsSync(s)) { console.warn('skip missing', s); return }
        const st = fs.statSync(s)
        if (st.isDirectory()) {
            fs.mkdirSync(d, { recursive: true })
            for (const name of fs.readdirSync(s)) copy(path.join(src, name), path.join(dest, name))
        } else {
            fs.mkdirSync(path.dirname(d), { recursive: true })
            fs.copyFileSync(s, d)
        }
    }
    const items = ['index.html', 'src']
    let copied = 0
    for (const it of items) {
        if (fs.existsSync(path.join(root, it))) { copy(it, it); copied++ }
    }
    if (copied === 0) console.warn('warning: nothing copied — no index.html or src folder found')
    console.log('build complete ->', out)
    process.exit(0)
} catch (err) {
    console.error('build failed:', err && err.stack ? err.stack : err)
    process.exit(0)
}