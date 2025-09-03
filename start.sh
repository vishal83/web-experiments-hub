#!/bin/bash

# WebCodecs Test Suite Startup Script
# Automatically detects available runtime and starts the appropriate server

echo "🎥 WebCodecs Test Suite"
echo "======================="

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "✅ Node.js found - starting Node.js server..."
    echo ""
    exec node server.js
elif command -v python3 &> /dev/null; then
    echo "✅ Python 3 found - starting Python server..."  
    echo ""
    exec python3 server.py
elif command -v python &> /dev/null; then
    echo "✅ Python found - starting Python server..."
    echo ""
    exec python server.py
else
    echo "❌ Error: Neither Node.js nor Python found!"
    echo ""
    echo "Please install one of the following:"
    echo "  - Node.js: https://nodejs.org/"
    echo "  - Python 3: https://www.python.org/"
    echo ""
    echo "Then run:"
    echo "  node server.js    (for Node.js)"
    echo "  python3 server.py (for Python)"
    exit 1
fi
