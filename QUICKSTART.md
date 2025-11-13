# ⚡ Quick Start Guide

## 🚀 Start Development Server

```bash
./dev-server.sh
```

**Open:** http://localhost:4000/portfolio/

## 🛑 Stop Server

Press `Ctrl + C`

## 📝 Common Tasks

### Add a New Project
1. Create file in `_projects/my-project.md`
2. Add frontmatter:
   ```yaml
   ---
   title: My Project
   anchor_id: my-project
   card_image: images/MyProject/thumbnail.png
   tags: [AR, VR, Game]
   summary: Short description
   ---
   ```
3. Add images to `images/MyProject/`
4. Save and refresh browser

### Add a Blog Post
1. Create `_posts/YYYY-MM-DD-title.md`
2. Add content with frontmatter
3. Save and refresh

### Edit Styles
1. Edit files in `assets/sass/`
2. Jekyll auto-compiles to CSS
3. Refresh browser

## 🎯 Access Your Site

- **Local:** http://localhost:4000/portfolio/
- **Live:** https://mahadishere.github.io/portfolio

## 📚 More Help

- Full guide: `LOCAL_DEVELOPMENT.md`
- Architecture: `.cursorrules`

