const http = require('http');
const fs = require('fs');
const path = require('path');

// MIME types for different file extensions
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg'
};

function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

function logRequest(req, statusCode) {
    const timestamp = new Date().toISOString();
    const method = req.method;
    const url = req.url;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    
    console.log(`[${timestamp}] ${method} ${url} - ${statusCode} - ${userAgent.substring(0, 50)}...`);
}

const server = http.createServer((req, res) => {
    // Handle CORS for cross-origin requests (useful for testing on different devices)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        logRequest(req, 200);
        return;
    }

    // Parse URL
    let filePath = req.url === '/' ? '/index.html' : req.url;
    
    // Remove query parameters
    const urlParts = filePath.split('?');
    filePath = urlParts[0];
    
    // Security: prevent directory traversal
    if (filePath.includes('..')) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Bad Request: Invalid path');
        logRequest(req, 400);
        return;
    }

    // Construct full file path
    const fullPath = path.join(__dirname, filePath);
    
    // Check if file exists
    fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 - File Not Found</title></head>
                <body>
                    <h1>404 - File Not Found</h1>
                    <p>The requested file <code>${filePath}</code> was not found.</p>
                    <p><a href="/">Go back to WebCodecs Test</a></p>
                </body>
                </html>
            `);
            logRequest(req, 404);
            return;
        }

        // Read and serve the file
        fs.readFile(fullPath, (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                logRequest(req, 500);
                return;
            }

            const contentType = getContentType(fullPath);
            
            // Set security headers for HTML files
            if (contentType === 'text/html') {
                res.setHeader('X-Content-Type-Options', 'nosniff');
                res.setHeader('X-Frame-Options', 'DENY');
                res.setHeader('X-XSS-Protection', '1; mode=block');
            }

            res.writeHead(200, { 
                'Content-Type': contentType,
                'Content-Length': data.length
            });
            res.end(data);
            logRequest(req, 200);
        });
    });
});

// Get port from environment or use default
const PORT = process.env.PORT || 8000;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
    console.log('🚀 WebCodecs Test Server Started!');
    console.log('=====================================');
    console.log(`🌐 Server running at: http://${HOST}:${PORT}`);
    console.log(`📱 Local access: http://localhost:${PORT}`);
    
    // Try to get local IP for network access
    const os = require('os');
    const interfaces = os.networkInterfaces();
    const addresses = [];
    
    for (const k in interfaces) {
        for (const k2 in interfaces[k]) {
            const address = interfaces[k][k2];
            if (address.family === 'IPv4' && !address.internal) {
                addresses.push(address.address);
            }
        }
    }
    
    if (addresses.length > 0) {
        console.log('📶 Network access:');
        addresses.forEach(addr => {
            console.log(`   http://${addr}:${PORT}`);
        });
    }
    
    console.log('=====================================');
    console.log('💡 Tips:');
    console.log('   - Use HTTPS for full WebCodecs functionality on remote devices');
    console.log('   - Test on different browsers: Chrome, Firefox, Safari, Edge');
    console.log('   - Check mobile devices for codec support differences');
    console.log('=====================================');
    console.log('📊 Access the WebCodecs test at the URLs above');
    console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    server.close(() => {
        console.log('✅ Server shut down gracefully');
        process.exit(0);
    });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('💥 Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
