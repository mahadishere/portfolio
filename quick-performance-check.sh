#!/bin/bash
# Quick Performance Check Script
# Run this before publishing to catch large files

echo "📊 Performance Check Before Publishing"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "1. Checking image sizes..."
echo "---------------------------"
LARGE_IMAGES=$(find images -type f \( -name "*.jpg" -o -name "*.png" \) -size +500k 2>/dev/null | wc -l | tr -d ' ')
if [ "$LARGE_IMAGES" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $LARGE_IMAGES large images (>500KB):${NC}"
    find images -type f \( -name "*.jpg" -o -name "*.png" \) -size +500k -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $5, $9}'
else
    echo -e "${GREEN}✅ No large images found${NC}"
fi

echo ""
echo "2. Checking video sizes..."
echo "---------------------------"
LARGE_VIDEOS=$(find images -type f -name "*.mp4" -size +5M 2>/dev/null | wc -l | tr -d ' ')
if [ "$LARGE_VIDEOS" -gt 0 ]; then
    echo -e "${YELLOW}⚠️  Found $LARGE_VIDEOS large videos (>5MB):${NC}"
    find images -type f -name "*.mp4" -size +5M -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $5, $9}'
else
    echo -e "${GREEN}✅ No large videos found${NC}"
fi

echo ""
echo "3. Checking audio files..."
echo "---------------------------"
if [ -f "assets/audio/background-music.mp3" ]; then
    AUDIO_SIZE=$(du -h assets/audio/background-music.mp3 2>/dev/null | awk '{print $1}')
    echo "Background music: $AUDIO_SIZE"
    if [ -f "assets/audio/background-music.mp3" ] && [ $(stat -f%z assets/audio/background-music.mp3 2>/dev/null || stat -c%s assets/audio/background-music.mp3 2>/dev/null) -gt 2000000 ]; then
        echo -e "${YELLOW}⚠️  Audio file is large (>2MB) - make sure it's lazy loaded${NC}"
    else
        echo -e "${GREEN}✅ Audio file size is reasonable${NC}"
    fi
else
    echo -e "${GREEN}✅ No audio file found${NC}"
fi

echo ""
echo "4. Checking CSS sizes..."
echo "---------------------------"
if [ -d "assets/css" ]; then
    CSS_TOTAL=$(du -sh assets/css 2>/dev/null | awk '{print $1}')
    echo "Total CSS: $CSS_TOTAL"
    LARGE_CSS=$(find assets/css -name "*.css" -size +50k 2>/dev/null | wc -l | tr -d ' ')
    if [ "$LARGE_CSS" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $LARGE_CSS large CSS files (>50KB):${NC}"
        find assets/css -name "*.css" -size +50k -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $5, $9}'
    fi
fi

echo ""
echo "5. Checking JavaScript sizes..."
echo "---------------------------"
if [ -d "assets/js" ]; then
    JS_TOTAL=$(du -sh assets/js 2>/dev/null | awk '{print $1}')
    echo "Total JS: $JS_TOTAL"
    LARGE_JS=$(find assets/js -name "*.js" -size +50k 2>/dev/null | wc -l | tr -d ' ')
    if [ "$LARGE_JS" -gt 0 ]; then
        echo -e "${YELLOW}⚠️  Found $LARGE_JS large JS files (>50KB):${NC}"
        find assets/js -name "*.js" -size +50k -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $5, $9}'
    fi
fi

echo ""
echo "6. Top 10 largest files..."
echo "---------------------------"
echo -e "${YELLOW}Files to review:${NC}"
find . -type f ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./_site/*" ! -path "./.DS_Store" -size +200k -exec ls -lh {} \; 2>/dev/null | awk '{print "  " $5, $9}' | sort -hr | head -10

echo ""
echo "======================================"
echo -e "${GREEN}✅ Check complete!${NC}"
echo ""
echo "💡 Next steps:"
echo "   1. Test with DevTools Network throttling (Slow 3G)"
echo "   2. Run Lighthouse audit (aim for 80+ score)"
echo "   3. Check that audio has preload='none'"
echo "   4. Verify icons use custom-icons.css (not FontAwesome)"
echo ""
echo "📖 See PERFORMANCE_TESTING_GUIDE.md for detailed instructions"

