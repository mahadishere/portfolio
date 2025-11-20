# 📸 CMS Image Optimization Guide

## ✅ Automatic Optimization (Live CMS)

**Good news!** Images uploaded via the **live CMS** are automatically optimized by GitHub Actions.

### How It Works:
1. Upload images via CMS (any size/format)
2. Commit and push to GitHub
3. **GitHub Action automatically:**
   - Converts large PNG files (>300KB) to JPEG
   - Compresses JPEG files to 85% quality
   - Resizes very large images to max 1200px
   - Commits optimized images back to the repository

### No Action Required! 🎉
Just upload images normally - optimization happens automatically within a few minutes.

---

## 🖥️ Local Development

For **local development**, use the optimization script:

```bash
./optimize-images.sh
```

Run this after adding images locally to optimize them before committing.

---

## 📋 Image Size Guidelines

**Target sizes for web:**
- **Card images (thumbnails):** 200-400KB, max 800px width
- **Gallery images:** 300-600KB, max 1200px width
- **Large hero images:** 500KB-1MB, max 1920px width

**The automatic optimization:**
- Converts PNG > 300KB → JPEG (75% quality)
- Compresses JPEG to 85% quality
- Resizes images > 500KB to max 1200px width
- Skips images already < 300KB

---

## 💡 Tips

1. **Upload JPEG when possible** - Smaller than PNG for photos
2. **Use PNG only for graphics** - Logos, icons, graphics with transparency
3. **Don't worry about size** - GitHub Actions will optimize automatically
4. **Check GitHub Actions tab** - See optimization status after upload

---

## 🔍 Manual Optimization (Optional)

If you want to optimize before upload (not necessary, but can save time):

### macOS (Built-in tools):
```bash
# Convert PNG to JPEG
sips -s format jpeg -s formatOptions 75 input.png --out output.jpg

# Resize image
sips -Z 1200 input.jpg
```

### Online Tools:
- **TinyPNG** - https://tinypng.com/
- **Squoosh** - https://squoosh.app/
- **ImageOptim** - Desktop app for macOS

---

## 📝 Workflow Summary

### Live CMS (Production):
1. ✅ Upload images via CMS
2. ✅ Save/commit
3. ✅ **GitHub Actions optimizes automatically** (within 2-5 minutes)
4. ✅ Site rebuilds with optimized images

### Local Development:
1. Add images locally
2. Run `./optimize-images.sh`
3. Commit optimized images

---

## ⚙️ GitHub Action Details

The optimization workflow (`.github/workflows/optimize-images.yml`) runs:
- **Trigger:** When images are pushed to `images/` folder
- **Actions:**
  - Compresses JPEG files
  - Converts large PNG to JPEG
  - Resizes oversized images
  - Commits changes back automatically

You can view the workflow status in the **Actions** tab on GitHub.
