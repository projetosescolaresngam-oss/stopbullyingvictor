// ================================================================
// PROJETO STOPBULLYING — SERVIDOR WEB LOCAL (NODE.JS NATIVO)
// EEMTI Nazaré Guerra — Ceará Científico 2026
// ================================================================

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.pdf': 'application/pdf',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url.split('?')[0].split('#')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  // Decodificar caracteres especiais no caminho do arquivo
  try {
    reqUrl = decodeURIComponent(reqUrl);
  } catch (e) {}

  const filePath = path.join(__dirname, reqUrl);
  const ext = path.extname(filePath).toLowerCase();
  const mimeType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>404 Página Não Encontrada</h1><p>O arquivo solicitado não foi encontrado no servidor.</p>');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>500 Erro Interno do Servidor</h1><p>${err.code}</p>`);
      }
    } else {
      res.writeHead(200, {
        'Content-Type': mimeType,
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('====================================================');
  console.log(`🚀 SERVIDOR WEB LOCAL DO STOPBULLYING ATIVO!`);
  console.log(`📱 App do Aluno:   http://localhost:${PORT}`);
  console.log(`🔒 Painel Gestão:  http://localhost:${PORT}/gestaoequipestop.html`);
  console.log(`🔬 Banner Feira:   http://localhost:${PORT}/banner_stopbullying_ceara_cientifico_2026.html`);
  console.log('====================================================');
});
