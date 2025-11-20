# 📝 Project Management Guide

This guide explains how to add new projects and update existing ones in your portfolio website.

---

## 🎯 Overview

Your portfolio is **fully CMS-manageable**! All project content is stored in markdown files in the `_projects/` collection, and both the project grid cards and detail panels are automatically rendered from this data.

**Everything can be managed via Netlify CMS** - no manual HTML editing required!

---

## ➕ Adding New Projects

### Method 1: Via Netlify CMS (Recommended - Fully Manageable!)

1. **Navigate to CMS:**
   - Go to `https://mahadishere.github.io/portfolio/admin`
   - Or locally: `http://localhost:4000/portfolio/admin`

2. **Create New Project:**
   - Click "New Project" button
   - Fill in all fields (see field descriptions below)
   - **That's it!** The project will automatically appear in both the grid and detail view

3. **No HTML editing needed** - everything is rendered automatically from your markdown file!

### Method 2: Manual (For Developers)

#### Step 1: Create Project Markdown File

Create a new file in `_projects/` with the naming convention: `lowercase-with-hyphens.md`

**Example:** `my-new-project.md`

**Required Frontmatter Template:**
```yaml
---
title: Project Name (Technology)
anchor_id: mynewproject
card_image: images/ProjectName/thumbnail.png
xr_technology: AR  # Optional: AR, VR, MR, or leave empty
domain:            # Optional: Can be array
  - Medical
  - Manufacturing
project_type:      # Optional: Can be array
  - App
  - R&D
  - CV
platform: HoloLens  # Optional: HoloLens, Quest, PCVR, Mobile, Web, Desktop, Cross-Platform
featured: false     # Optional: true to show featured badge
tags: [Keyword1, Keyword2]  # Optional: Array of keywords
summary: Short description that appears on the project card
external_url: https://example.com  # Optional
external_label: "Live Demo"        # Optional
---
```

**Field Descriptions:**
- **`title`**: Display name (appears in grid and panel header)
- **`anchor_id`**: Must be unique, lowercase, no spaces (used for `#anchor` navigation)
- **`card_image`**: Path to thumbnail image (relative to site root, e.g., `images/ProjectName/thumbnail.png`)
- **`xr_technology`**: Single value - AR, VR, or MR
- **`domain`**: Array - Medical, Manufacturing, Commercial, Architecture, Education, Entertainment
- **`project_type`**: Array - Game, App, R&D, CV, AI, Tool, Virtual Tour, 3D Visualization, 3D Model
- **`platform`**: Single value - Primary platform/device
- **`featured`**: Boolean - Shows gold star badge if true
- **`tags`**: Array - Additional keywords for search
- **`summary`**: Short description (1-2 sentences)
- **`external_links`**: Array of objects with `url` and `label` - Can add multiple links (demos, GitHub, etc.)
- **`header_note`**: Optional text shown in header (e.g., "Note: Beta version")
- **`gallery_images`**: Array of objects with `path` and `alt` - Images displayed in project gallery
- **`body`**: Markdown content - Main project description and details (supports full markdown)

#### Step 2: Add Images

1. Create a folder in `/images/` matching your project name (e.g., `/images/MyProject/`)
2. Add your images to this folder
3. Reference them in both:
   - The `card_image` field (for the grid thumbnail)
   - The HTML panel (for the gallery)

**Image Naming Convention:**
- Use descriptive names: `screenshot-01.png`, `demo-view.png`
- Keep thumbnail small (~400x300px) for `card_image`
- Gallery images can be larger

---

## ✏️ Updating Existing Projects

### Method 1: Via Netlify CMS (Recommended)

1. Go to `/admin`
2. Click on the project you want to edit
3. Modify any fields:
   - Update frontmatter (title, tags, summary, etc.)
   - Edit content in the "Content" field (supports markdown)
   - Add/remove gallery images
   - Update external links
4. Click "Save" - changes commit to GitHub automatically
5. **That's it!** Changes appear automatically - no HTML editing needed

### Method 2: Edit Markdown Files Directly

1. Open the project file in `_projects/` (e.g., `360lens.md`)
2. Edit the frontmatter fields or markdown content
3. Save the file
4. Commit and push to GitHub

**Common Updates:**
- **Change thumbnail:** Update `card_image` in frontmatter
- **Update description:** Edit `summary` (for grid) or `body` (for detail view)
- **Add images:** Add entries to `gallery_images` array in frontmatter
- **Change links:** Update `external_links` array in frontmatter
- **Update tags:** Modify `tags` array in frontmatter
- **Add content:** Write markdown in the `body` section

---

## 📋 Project Examples

### Example 1: Simple AR App

**Markdown File** (`_projects/simple-ar.md`):
```yaml
---
title: Simple AR App
anchor_id: simplear
card_image: images/SimpleAR/thumbnail.png
xr_technology: AR
domain:
  - Commercial
project_type:
  - App
platform: Mobile
featured: false
tags: [AR, Mobile, iOS]
summary: A simple AR application for product visualization.
external_links:
  - url: https://example.com
    label: Live Demo
gallery_images:
  - path: images/SimpleAR/screenshot1.png
    alt: AR view
---

This AR app allows users to visualize products in their real environment using their smartphone camera.
```

### Example 2: Game Project

**Markdown File** (`_projects/my-game.md`):
```yaml
---
title: My Awesome Game
anchor_id: mygame
card_image: images/MyGame/thumbnail.png
xr_technology: VR
domain:
  - Entertainment
project_type:
  - Game
platform: Quest
featured: true
tags: [VR, Game, Quest, Multiplayer]
summary: An immersive VR game with multiplayer support.
---
```

---

## 🔍 Troubleshooting

### Project Not Appearing in Grid

**Check:**
1. ✅ File is in `_projects/` folder with `.md` extension
2. ✅ Frontmatter is valid YAML (check for syntax errors)
3. ✅ `anchor_id` is unique (no duplicates)
4. ✅ `card_image` path is correct and image exists
5. ✅ Run `bundle exec jekyll serve` to rebuild

### Navigation Link Not Working

**Check:**
1. ✅ `anchor_id` is correctly set in frontmatter
2. ✅ No typos in anchor IDs (case-sensitive)
3. ✅ Project file exists and is valid

### Images Not Loading

**Check:**
1. ✅ Image files exist in `/images/ProjectName/` folder
2. ✅ Using `relative_url` Liquid filter: `{{ '/images/path.png' | relative_url }}`
3. ✅ Paths are relative to site root (start with `/images/`)
4. ✅ No typos in file names (case-sensitive on some systems)

### Filtering Not Working

**Check:**
1. ✅ `xr_technology` matches exactly: AR, VR, or MR (case-sensitive)
2. ✅ `domain` values match: Medical, Manufacturing, etc.
3. ✅ `project_type` values match: Game, App, R&D, CV, AI, Tool, etc.
4. ✅ Arrays are properly formatted in YAML

---

## 📊 Current Projects Reference

| Project | Anchor ID | File Name |
|---------|-----------|-----------|
| 360Lens | `360lens` | `360lens.md` |
| Hotspring | `hotspring` | `hotspring.md` |
| SolidVR | `sldvr` | `solidvr.md` |
| DICOM | `dicom` | `dicom.md` |
| AprilTag 3 | `aprltg` | `apriltag3.md` |
| Vampire Capitalist | `VC` | `vampire-capitalist.md` |
| Zombie Tag Royale | `ztr` | `zombie-tag-royale.md` |

---

## 🎨 Best Practices

1. **Consistency:**
   - Use consistent naming: `lowercase-with-hyphens.md`
   - Keep `anchor_id` simple and memorable
   - Organize images in project-specific folders

2. **Content:**
   - Write clear, concise summaries (1-2 sentences)
   - Use descriptive image alt text
   - Include relevant tags for searchability

3. **Images:**
   - Optimize images before uploading (compress if needed)
   - Use appropriate sizes (thumbnails ~400x300px)
   - Use lazy loading: `loading="lazy"`

4. **Links:**
   - Always use `target="_blank" rel="noopener"` for external links
   - Test all links after adding/updating

5. **Testing:**
   - Test locally with `bundle exec jekyll serve`
   - Verify project appears in grid
   - Test navigation and filtering
   - Check dark mode compatibility

---

## 🚀 Quick Checklist

When adding a new project:

- [ ] Create markdown file in `_projects/` (or use CMS)
- [ ] Fill in all frontmatter fields (title, anchor_id, card_image, summary)
- [ ] Add content in the `body` section (markdown supported)
- [ ] Add external links in `external_links` array (if any)
- [ ] Add gallery images in `gallery_images` array (if any)
- [ ] Create image folder in `/images/` and add images
- [ ] Test locally with `bundle exec jekyll serve`
- [ ] Commit and push to GitHub (or save via CMS)

---

**Need Help?** Refer to existing projects as examples, or check the repo-specific rules in `.cursorrules` for architecture details.

