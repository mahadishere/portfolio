# 🧪 Performance Testing Guide - Before Publishing

## Why Local Testing is Fast

Local testing is fast because:
- Files load from your hard drive (instant)
- No network latency
- No DNS lookups
- No server response time
- Files aren't compressed/minified

## 🛠️ Tools for Realistic Performance Testing

### 1. Browser DevTools Network Throttling (Easiest)

**Chrome/Edge:**
1. Open DevTools (F12 or Cmd+Option+I)
2. Go to **Network** tab
3. Click the throttling dropdown (default: "No throttling")
4. Select:
   - **Slow 3G** - Simulates 3G connection (~400 Kbps)
   - **Fast 3G** - Simulates faster 3G (~1.6 Mbps)
   - **4G** - Simulates 4G connection (~4 Mbps)
   - **Custom** - Create your own profile

**Firefox:**
1. Open DevTools (F12)
2. Go to **Network** tab
3. Click the gear icon
4. Enable "Throttling" and select speed

**What to check:**
- Total page load time
- Individual file sizes
- Number of HTTP requests
- Time to First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

### 2. Lighthouse Performance Audit (Recommended)

**Chrome/Edge:**
1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select:
   - ✅ Performance
   - ✅ Desktop or Mobile
   - ✅ Simulated throttling (for realistic results)
4. Click **Analyze page load**

**What to look for:**
- **Performance Score:** Aim for 90+
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **Total Blocking Time (TBT):** < 200ms
- **Cumulative Layout Shift (CLS):** < 0.1

**Firefox:**
- Use **WebPageTest** (online) or install Lighthouse extension

### 3. Build Production Version Locally

Test the actual Jekyll build that will be deployed:

```bash
# Build the site (same as GitHub Pages)
bundle exec jekyll build

# Serve the built site
bundle exec jekyll serve --host 0.0.0.0 --port 4000

# Or use the built _site folder
cd _site
python3 -m http.server 8000
```

Then test `http://localhost:4000` or `http://localhost:8000` with throttling enabled.

### 4. Check File Sizes

**Before deploying, verify file sizes:**

```bash
# Check total size of assets
du -sh assets/

# Check individual file sizes
find assets -type f -exec ls -lh {} \; | awk '{print $5, $9}' | sort -hr

# Check image sizes
find images -type f \( -name "*.jpg" -o -name "*.png" -o -name "*.mp4" \) -exec ls -lh {} \; | awk '{print $5, $9}' | sort -hr | head -20

# Check total page weight
du -sh _site/
```

**Red flags:**
- Any image > 500KB (should be < 300KB for web)
- Any video > 5MB (should be < 3MB)
- Total CSS > 200KB (should be < 100KB)
- Total JS > 150KB (should be < 100KB)

### 5. Network Waterfall Analysis

**In DevTools Network tab:**
1. Enable throttling (Slow 3G)
2. Reload page
3. Check the waterfall chart

**Look for:**
- **Blocking resources:** CSS/JS that delay rendering
- **Large files:** Files taking > 2 seconds to load
- **Sequential loading:** Files loading one after another (should be parallel)
- **Unused files:** Files loaded but not used

### 6. WebPageTest (Online - Most Realistic)

**Best for final testing before publishing:**

1. Go to https://www.webpagetest.org/
2. Enter your GitHub Pages URL (after publishing)
3. Select:
   - **Test Location:** Choose closest to your users
   - **Browser:** Chrome or Firefox
   - **Connection:** 3G or 4G
4. Run test

**Provides:**
- Real-world load times
- Performance metrics
- Filmstrip view of page loading
- Recommendations

### 7. Check HTTP Headers (After Publishing)

**Verify compression and caching:**

```bash
# Check if files are compressed
curl -H "Accept-Encoding: gzip" -I https://mahadishere.github.io/portfolio/assets/css/modules/custom-icons.css

# Check cache headers
curl -I https://mahadishere.github.io/portfolio/assets/css/modules/custom-icons.css
```

**What to verify:**
- `Content-Encoding: gzip` (files should be compressed)
- `Cache-Control` headers (browser caching)

## 📋 Pre-Publish Checklist

### File Size Checks
- [ ] No images > 500KB
- [ ] No videos > 5MB
- [ ] Total CSS < 200KB
- [ ] Total JS < 150KB
- [ ] Background music lazy loads (not on initial page load)

### Performance Metrics (with Slow 3G throttling)
- [ ] First Contentful Paint < 2.5s
- [ ] Largest Contentful Paint < 4s
- [ ] Total page load < 10s
- [ ] Lighthouse Performance Score > 80

### Functionality Checks
- [ ] All icons display correctly
- [ ] Dark/light mode works
- [ ] Images lazy load
- [ ] Audio doesn't load on page load
- [ ] Navigation works
- [ ] Project filters work

### Network Analysis
- [ ] < 30 HTTP requests on initial load
- [ ] Critical CSS loads first
- [ ] Non-critical resources deferred
- [ ] No blocking JavaScript

## 🎯 Quick Test Script

Create a simple test script:

```bash
#!/bin/bash
# quick-performance-check.sh

echo "📊 Performance Check Before Publishing"
echo "======================================"
echo ""

echo "1. Checking file sizes..."
echo "Largest images:"
find images -type f \( -name "*.jpg" -o -name "*.png" \) -exec ls -lh {} \; | awk '{print $5, $9}' | sort -hr | head -5

echo ""
echo "2. Checking asset sizes..."
echo "CSS total:"
du -sh assets/css/
echo "JS total:"
du -sh assets/js/

echo ""
echo "3. Checking for large files..."
find . -type f -size +500k ! -path "./.git/*" ! -path "./node_modules/*" ! -path "./_site/*" -exec ls -lh {} \; | awk '{print $5, $9}'

echo ""
echo "✅ Check complete!"
echo "💡 Next: Test with DevTools throttling enabled"
```

Save as `quick-performance-check.sh` and run:
```bash
chmod +x quick-performance-check.sh
./quick-performance-check.sh
```

## 🔍 What Good Performance Looks Like

### On Slow 3G (400 Kbps):
- **First Contentful Paint:** 2-3 seconds
- **Largest Contentful Paint:** 4-6 seconds
- **Time to Interactive:** 6-8 seconds
- **Total Load Time:** 8-12 seconds

### On Fast 3G (1.6 Mbps):
- **First Contentful Paint:** < 1.5 seconds
- **Largest Contentful Paint:** < 3 seconds
- **Time to Interactive:** < 4 seconds
- **Total Load Time:** < 5 seconds

### On 4G (4 Mbps):
- **First Contentful Paint:** < 1 second
- **Largest Contentful Paint:** < 2 seconds
- **Time to Interactive:** < 2 seconds
- **Total Load Time:** < 3 seconds

## 🚨 Red Flags to Watch For

1. **Files > 1MB** - Should be optimized
2. **> 50 HTTP requests** - Too many files
3. **LCP > 4s on 3G** - Largest image too big
4. **TBT > 300ms** - Too much blocking JavaScript
5. **FCP > 3s on 3G** - Critical CSS too large

## 💡 Pro Tips

1. **Test in Incognito Mode** - No extensions/cache interference
2. **Clear cache between tests** - DevTools > Application > Clear storage
3. **Test on mobile viewport** - Mobile performance is different
4. **Compare before/after** - Take screenshots of Lighthouse scores
5. **Test after publishing** - Real CDN performance may differ

## 📊 Example Test Results

**Before Optimization:**
- Performance Score: 45
- FCP: 4.2s
- LCP: 8.5s
- Total Load: 12s

**After Optimization:**
- Performance Score: 85
- FCP: 1.8s
- LCP: 3.2s
- Total Load: 5s

---

**Remember:** Local testing is always fast. Always test with throttling enabled to simulate real-world conditions!

