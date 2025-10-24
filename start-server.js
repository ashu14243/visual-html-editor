const http = require('http');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 3000;
const cwd = process.cwd();
const candidates = [cwd, path.join(cwd,'public'), path.join(cwd,'dist'), path.join(cwd,'src')];
let root = cwd;
for (const c of candidates) {
  if (fs.existsSync(path.join(c,'index.html'))) { root = c; break; }
}
const mime = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};
http.createServer((req, res) => {
  let reqPath = decodeURIComponent(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) reqPath += 'index.html';
  const filePath = path.join(root, reqPath);
  console.log(new Date().toISOString(), req.method, req.url, '->', filePath);
  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    res.end('Forbidden');
    return;
  }
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.statusCode = 404;
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': type });
    fs.createReadStream(filePath).pipe(res);
  });
}).listen(port, () => {
  console.log('listening on http://localhost:' + port, 'serving from', root);
});