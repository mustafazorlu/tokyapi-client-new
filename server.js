// Basit Node.js HTTP Server
// Bu dosyayı kullanmak için: node server.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    let pathname = url.parse(req.url).pathname;
    
    // Ana dizine yönlendir
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    const filePath = path.join(__dirname, pathname);
    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';
    
    // Dosya varlığını kontrol et
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // 404 - Dosya bulunamadı
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>404 - Sayfa Bulunamadı</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                        h1 { color: #CB071D; }
                    </style>
                </head>
                <body>
                    <h1>404 - Sayfa Bulunamadı</h1>
                    <p>Aradığınız sayfa bulunamadı.</p>
                    <a href="/">Ana Sayfaya Dön</a>
                </body>
                </html>
            `);
            return;
        }
        
        // Dosyayı oku ve gönder
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Sunucu Hatası');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
});

server.listen(PORT, () => {
    console.log('🚀 TOK YAPI PROJE Server başlatıldı!');
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`📁 Dizin: ${__dirname}`);
    console.log('🔴 Durdurmak için Ctrl+C tuşlayın');
    
    // Tarayıcıyı otomatik aç (sadece local development için)
    if (process.platform === 'darwin') {
        require('child_process').exec(`open http://localhost:${PORT}`);
    } else if (process.platform === 'win32') {
        require('child_process').exec(`start http://localhost:${PORT}`);
    }
}); 