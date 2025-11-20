#!/bin/bash

# 🖼️ Image Optimization Script
# Automatically optimizes images added via CMS or manually
# Run this after adding new images to compress them

echo "🖼️  Image Optimization Script"
echo "=============================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if sips is available (macOS built-in)
if ! command -v sips &> /dev/null; then
    echo "❌ Error: sips command not found (macOS only)"
    exit 1
fi

# Directory to optimize
PROJECTS_DIR="images/projects"
HOME_DIR="images/home"

# Counter
OPTIMIZED=0
SKIPPED=0

echo "📁 Optimizing images in:"
echo "   - $PROJECTS_DIR"
echo "   - $HOME_DIR"
echo ""

# Function to optimize a single image
optimize_image() {
    local img="$1"
    local max_size="$2"
    
    # Get file size in KB
    local size_kb=$(stat -f%z "$img" 2>/dev/null | awk '{print int($1/1024)}')
    
    # Skip if already small
    if [ "$size_kb" -lt 300 ]; then
        echo "   ⏭️  Skipping $(basename "$img") (already small: ${size_kb}KB)"
        ((SKIPPED++))
        return
    fi
    
    # Get file extension
    local ext="${img##*.}"
    local name="${img%.*}"
    
    if [ "$ext" = "png" ]; then
        # Convert large PNG to JPEG
        echo "   🔄 Converting $(basename "$img") (${size_kb}KB PNG → JPEG)"
        sips -s format jpeg -s formatOptions 75 "$img" --out "${name}.jpg" >/dev/null 2>&1
        
        if [ -f "${name}.jpg" ]; then
            local new_size=$(stat -f%z "${name}.jpg" 2>/dev/null | awk '{print int($1/1024)}')
            local saved=$((size_kb - new_size))
            echo "      ✅ Saved ${saved}KB (${size_kb}KB → ${new_size}KB)"
            rm -f "$img"  # Remove original PNG
            ((OPTIMIZED++))
        fi
    elif [ "$ext" = "jpg" ] || [ "$ext" = "jpeg" ]; then
        # Resize large JPEG
        echo "   📐 Resizing $(basename "$img") (${size_kb}KB)"
        sips -Z "$max_size" "$img" >/dev/null 2>&1
        local new_size=$(stat -f%z "$img" 2>/dev/null | awk '{print int($1/1024)}')
        if [ "$new_size" -lt "$size_kb" ]; then
            local saved=$((size_kb - new_size))
            echo "      ✅ Saved ${saved}KB (${size_kb}KB → ${new_size}KB)"
            ((OPTIMIZED++))
        else
            ((SKIPPED++))
        fi
    fi
}

# Optimize project images
echo "📂 Processing project images..."
for img in $(find "$PROJECTS_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -size +300k 2>/dev/null); do
    optimize_image "$img" 1200
done

# Optimize home images (card images, etc.)
echo ""
echo "📂 Processing home images..."
for img in $(find "$HOME_DIR" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.jpeg" \) -size +300k 2>/dev/null); do
    optimize_image "$img" 1200
done

# Summary
echo ""
echo "=============================="
echo "✅ Optimization Complete!"
echo "   Optimized: $OPTIMIZED files"
echo "   Skipped: $SKIPPED files (already small)"
echo ""
echo "💡 Tip: Run this script after adding images via CMS"
echo "   Usage: ./optimize-images.sh"

