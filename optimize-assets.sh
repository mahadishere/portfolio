#!/bin/bash
# Asset Optimization Script for Portfolio Website
# Combines and minifies CSS/JS files to reduce HTTP requests

set -e

echo "🚀 Starting asset optimization..."

# Create optimized directories
mkdir -p assets/css/optimized
mkdir -p assets/js/optimized

# Check if required tools are installed
command -v npx >/dev/null 2>&1 || { echo "❌ Error: npx is required but not installed. Install Node.js."; exit 1; }

echo "📦 Combining CSS files..."

# Combine critical CSS files (core + layout)
cat assets/css/modules/variables.css \
    assets/css/modules/reset.css \
    assets/css/modules/grid-base.css \
    assets/css/modules/grid-responsive.css \
    assets/css/modules/typography.css \
    assets/css/modules/custom-icons.css \
    assets/css/modules/wrapper.css \
    assets/css/modules/main-panel.css \
    assets/css/modules/footer.css \
    assets/css/modules/nav-base.css \
    assets/css/modules/mega-menu.css \
    > assets/css/optimized/critical.css

# Combine component CSS files
cat assets/css/modules/tables.css \
    assets/css/modules/forms.css \
    assets/css/modules/sections.css \
    assets/css/modules/images.css \
    assets/css/modules/buttons.css \
    assets/css/modules/lists.css \
    assets/css/modules/actions.css \
    assets/css/modules/project-cards.css \
    assets/css/modules/project-filters.css \
    assets/css/modules/project-badges.css \
    assets/css/modules/gallery.css \
    > assets/css/optimized/components.css

# Minify CSS (if cssnano is available)
if npx --yes cssnano --version >/dev/null 2>&1; then
    echo "✨ Minifying CSS..."
    npx --yes cssnano assets/css/optimized/critical.css assets/css/optimized/critical.min.css
    npx --yes cssnano assets/css/optimized/components.css assets/css/optimized/components.min.css
    npx --yes cssnano assets/css/modules/theme.css assets/css/optimized/theme.min.css
else
    echo "⚠️  cssnano not available, skipping minification"
    cp assets/css/optimized/critical.css assets/css/optimized/critical.min.css
    cp assets/css/optimized/components.css assets/css/optimized/components.min.css
    cp assets/css/modules/theme.css assets/css/optimized/theme.min.css
fi

echo "📦 Combining JavaScript files..."

# Combine custom JS files (excluding jQuery and vendor files)
cat assets/js/theme.js \
    assets/js/music.js \
    assets/js/video-loop.js \
    assets/js/main-width.js \
    assets/js/filter-state.js \
    assets/js/filter-logic.js \
    assets/js/project-filters.js \
    assets/js/mega-scrollbar.js \
    > assets/js/optimized/custom.js

# Minify JS (if terser is available)
if npx --yes terser --version >/dev/null 2>&1; then
    echo "✨ Minifying JavaScript..."
    npx --yes terser assets/js/optimized/custom.js -o assets/js/optimized/custom.min.js --compress --mangle
else
    echo "⚠️  terser not available, skipping minification"
    cp assets/js/optimized/custom.js assets/js/optimized/custom.min.js
fi

echo "✅ Optimization complete!"
echo ""
echo "📊 File sizes:"
ls -lh assets/css/optimized/*.min.css 2>/dev/null | awk '{print $5, $9}'
ls -lh assets/js/optimized/*.min.js 2>/dev/null | awk '{print $5, $9}'
echo ""
echo "💡 Next steps:"
echo "   1. Update _includes/head.html to use optimized CSS files"
echo "   2. Update _layouts/default.html to use optimized JS files"
echo "   3. Test the site to ensure everything works correctly"

