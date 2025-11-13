#!/bin/bash

# Portfolio Website Local Development Server
# This script starts the Jekyll development server

# Set up Ruby environment (Homebrew Ruby)
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting Portfolio Development Server...${NC}"
echo ""

# Check if bundle is available
if ! command -v bundle &> /dev/null; then
    echo "❌ Bundler not found. Installing..."
    gem install bundler
fi

# Install dependencies if needed
if [ ! -d "vendor/bundle" ] && [ ! -d ".bundle" ]; then
    echo "📦 Installing dependencies..."
    bundle install
fi

# Start Jekyll server
echo -e "${GREEN}✅ Server starting...${NC}"
echo ""
echo -e "${GREEN}📍 Access your site at: ${BLUE}http://localhost:4000/portfolio/${NC}"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

bundle exec jekyll serve

