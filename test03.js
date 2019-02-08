//index.html fs 내부 module을 사용하여 페이지 띄우기

const http = require('http');
const fs = require('fs');  // fs = file system
const hostname = '127.0.0.1';
const port = 8000;

const server = http.createServer(function (req, res) {
  res.writeHeader(200, { 'Content-Type': 'text/html; charset=utf-8' });
  fs.readFile('index.html', function (err, html) {
    if (err) { throw err;}
    res.end(html);
  });
});

server.listen(port, hostname, () => {
  console.log('Server running at http://${hostname}:${port}/');
});