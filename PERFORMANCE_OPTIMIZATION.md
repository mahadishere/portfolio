# 🚀 Performance Optimization Guide

## 🔴 Critical Issues Found

### 1. **Intro Video: 36MB** ⚠️ MAJOR BOTTLENECK
- **Location:** `images/home/intro-video.mp4`
- **Impact:** Blocks page load, causes slow initial render
- **Solution:** Compress to < 5MB

### 2. **Large Images** ⚠️
- Many images are 1-2.5MB each
- Should be optimized to 200-500KB for web

## 📊 File Size Analysis

### Largest Files:
- `intro-video.mp4`: **36MB** 🔴
- `us-apparel-02.png`: 2.5MB
- `us-apparel-01.png`: 2.3MB
- `us-apparel-03.png`: 2.2MB
- `m-ss-05.png`: 1.9MB
- `m-ss-01.png`: 1.9MB
- Multiple images: 1-1.6MB each

### Total Sizes:
- `images/home/`: 37MB (mostly the video)
- `images/projects/`: 25MB

## ✅ Optimization Solutions

### 1. **Video Optimization** (Priority 1)

**Option A: Compress the video**
```bash
# Using ffmpeg (if installed)
ffmpeg -i images/home/intro-video.mp4 \
  -vcodec h264 -acodec mp2 \
  -crf 28 \
  -preset slow \
  images/home/intro-video-optimized.mp4
```

**Option B: Use a smaller/shorter video**
- Keep video under 5MB
- Reduce resolution (1080p → 720p)
- Reduce frame rate if possible
- Shorter duration (5-10 seconds)

**Option C: Lazy load the video**
- Don't autoplay immediately
- Load on user interaction
- Or use a poster image instead

### 2. **Image Optimization** (Priority 2)

**For PNG images:**
```bash
# Using pngquant (install: brew install pngquant)
find images/projects -name "*.png" -exec pngquant --quality=65-80 --ext .png --force {} \;
```

**For all images:**
- Use tools like ImageOptim, TinyPNG, or Squoosh
- Target sizes:
  - **Card images (thumbnails):** 200-400KB, max 800px width
  - **Gallery images:** 300-600KB, max 1200px width
  - **Large hero images:** 500KB-1MB, max 1920px width

### 3. **Lazy Loading** (Already Implemented ✅)
- Gallery images already have `loading="lazy"`
- Card images should also have lazy loading

### 4. **Video Loading Strategy**

**Current:** Video autoplays immediately (loads 36MB on page load)

**Better Options:**

**Option 1: Poster image instead of video**
```html
<img src="{{ '/images/home/me.jpg' | relative_url }}" alt="Portrait">
```

**Option 2: Lazy load video**
```html
<video autoplay loop muted playsinline preload="none">
  <source src="{{ '/images/home/intro-video.mp4' | relative_url }}" type="video/mp4">
</video>
```

**Option 3: Load video after page load**
```javascript
window.addEventListener('load', function() {
  const video = document.querySelector('video');
  video.load();
});
```

## 🎯 Quick Wins (Do These First)

1. **Compress intro video** - This alone will dramatically improve load time
2. **Optimize card images** - These load first in the grid
3. **Add lazy loading to card images** - Don't load all images at once

## 📈 Expected Improvements

- **Before:** ~40MB+ initial load
- **After optimization:** ~2-5MB initial load
- **Load time improvement:** 80-90% faster

## 🛠️ Tools for Optimization

### Video:
- **ffmpeg** (command line)
- **HandBrake** (GUI)
- **CloudConvert** (online)

### Images:
- **ImageOptim** (Mac app)
- **TinyPNG** (online)
- **Squoosh** (Google, online)
- **pngquant** (command line)

## 📝 Checklist

- [ ] Compress intro-video.mp4 to < 5MB
- [ ] Optimize all card images (thumbnails) to < 400KB
- [ ] Optimize gallery images to < 600KB
- [ ] Add lazy loading to card images
- [ ] Consider using WebP format for better compression
- [ ] Test page load speed after optimization

