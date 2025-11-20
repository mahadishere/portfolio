#!/bin/bash

# Start the CMS proxy server for local development
# This allows the CMS to save files locally

echo "🚀 Starting CMS Proxy Server..."
echo ""
echo "📍 CMS Proxy will run on: http://localhost:8081"
echo "📍 Access CMS at: http://localhost:4000/portfolio/admin"
echo ""
echo "Press Ctrl+C to stop the proxy server"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   brew install node"
    exit 1
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the proxy server
npx netlify-cms-proxy-server

