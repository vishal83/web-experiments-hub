#!/usr/bin/env python3
"""
Simple HTTP server for WebCodecs testing
Serves static files and provides CORS headers for cross-origin testing
"""

import http.server
import socketserver
import os
import socket
import sys
from datetime import datetime
from urllib.parse import urlparse, unquote


class WebCodecsHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom HTTP request handler with CORS support and logging"""
    
    def __init__(self, *args, **kwargs):
        # Serve from current directory
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # Add CORS headers for cross-origin requests
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        
        # Security headers for HTML files
        if self.path.endswith('.html') or self.path == '/':
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.send_header('X-Frame-Options', 'DENY')
            self.send_header('X-XSS-Protection', '1; mode=block')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight CORS requests"""
        self.send_response(200)
        self.end_headers()
        self.log_request(200)
    
    def log_message(self, format, *args):
        """Custom logging format"""
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        user_agent = self.headers.get('User-Agent', 'Unknown')[:50]
        print(f"[{timestamp}] {format % args} - {user_agent}...")
    
    def do_GET(self):
        # Security: prevent directory traversal
        parsed_path = urlparse(self.path)
        clean_path = unquote(parsed_path.path)
        
        if '..' in clean_path:
            self.send_error(400, "Bad Request: Invalid path")
            return
        
        # Default to index.html for root path
        if self.path == '/':
            self.path = '/index.html'
        
        # Call parent implementation
        super().do_GET()
    
    def guess_type(self, path):
        """Enhanced MIME type guessing"""
        mime_type, _ = super().guess_type(path)
        
        # Add additional MIME types for WebCodecs testing
        if path.endswith('.webm'):
            return 'video/webm'
        elif path.endswith('.mp4'):
            return 'video/mp4'
        elif path.endswith('.ogg'):
            return 'audio/ogg'
        elif path.endswith('.opus'):
            return 'audio/opus'
        
        return mime_type


def get_local_ip():
    """Get local IP addresses for network access"""
    try:
        # Connect to a remote address to get local IP
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0)
        try:
            # Connect to Google DNS
            s.connect(('8.8.8.8', 80))
            ip = s.getsockname()[0]
        except Exception:
            ip = '127.0.0.1'
        finally:
            s.close()
        return ip
    except Exception:
        return '127.0.0.1'


def main():
    # Get port from environment or use default
    port = int(os.environ.get('PORT', 8000))
    host = os.environ.get('HOST', '0.0.0.0')
    
    try:
        # Create server
        with socketserver.TCPServer((host, port), WebCodecsHTTPRequestHandler) as httpd:
            httpd.allow_reuse_address = True
            
            print("🚀 WebCodecs Test Server Started!")
            print("=====================================")
            print(f"🌐 Server running at: http://{host}:{port}")
            print(f"📱 Local access: http://localhost:{port}")
            
            # Show network access URLs
            local_ip = get_local_ip()
            if local_ip != '127.0.0.1':
                print(f"📶 Network access: http://{local_ip}:{port}")
            
            print("=====================================")
            print("💡 Tips:")
            print("   - Use HTTPS for full WebCodecs functionality on remote devices")
            print("   - Test on different browsers: Chrome, Firefox, Safari, Edge")
            print("   - Check mobile devices for codec support differences")
            print("=====================================")
            print("📊 Access the WebCodecs test at the URLs above")
            print("🛑 Press Ctrl+C to stop the server")
            print("")
            
            # Start serving
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Shutting down server...")
        print("✅ Server shut down gracefully")
        sys.exit(0)
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {port} is already in use.")
            print("Try using a different port:")
            print(f"   PORT=8001 python3 server.py")
        else:
            print(f"❌ Error starting server: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
