# 🚀 Local Development Guide

This guide explains how to run your portfolio website locally on your MacBook Pro M3.

## ✅ Prerequisites (Already Installed)

- ✅ **Homebrew** - Package manager for macOS
- ✅ **Ruby 3.4.7** - Installed via Homebrew at `/opt/homebrew/opt/ruby/bin/ruby`
- ✅ **Bundler** - Ruby dependency manager
- ✅ **Jekyll & Dependencies** - All gems installed via bundle

## 🎯 Quick Start

### Option 1: Using the Helper Script (Easiest)

```bash
./dev-server.sh
```

This script automatically:
- Sets up the Ruby environment
- Installs any missing dependencies
- Starts the Jekyll server
- Shows you the URL to access your site

### Option 2: Manual Commands

```bash
# Set up Ruby environment
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"

# Start the server
bundle exec jekyll serve
```

## 🌐 Accessing Your Site

Once the server is running, open your browser and navigate to:

**http://localhost:4000/portfolio/**

The server will automatically rebuild the site when you make changes to files.

## 🛑 Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

## 🔧 Useful Commands

### Build the site without starting a server
```bash
bundle exec jekyll build
```

### Build with draft posts
```bash
bundle exec jekyll serve --drafts
```

### Serve on a different port
```bash
bundle exec jekyll serve --port 3000
```

### Clean build files
```bash
bundle exec jekyll clean
```

### Update dependencies
```bash
bundle update
```

## 🎨 Development Workflow

1. **Start the server:** Run `./dev-server.sh`
2. **Make changes:** Edit HTML, CSS, JavaScript, or Markdown files
3. **View changes:** Refresh your browser - Jekyll auto-rebuilds
4. **Test thoroughly:**
   - Check dark mode toggle
   - Test project filtering and search
   - Verify responsive design (mobile/tablet/desktop)
   - Test all navigation links
   - Ensure images load correctly

## 📁 Key Files to Edit

- **Projects:** `_projects/*.md` - Add/edit project case studies
- **Blog Posts:** `_posts/*.md` - Create new blog posts
- **Homepage:** `index.html` - Main landing page
- **Styles:** `assets/sass/**/*.scss` - Styling (compile to CSS automatically)
- **Config:** `_config.yml` - Site-wide configuration

## 🐛 Troubleshooting

### Server won't start

**Problem:** `bundle: command not found`

**Solution:**
```bash
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
gem install bundler
```

### Dependency errors

**Problem:** Missing gems or version conflicts

**Solution:**
```bash
bundle install
```

### Port already in use

**Problem:** `Address already in use - bind(2) for 127.0.0.1:4000`

**Solution:**
```bash
# Find and kill the process using port 4000
lsof -ti:4000 | xargs kill -9

# Or use a different port
bundle exec jekyll serve --port 3000
```

### Changes not showing

**Problem:** Site not updating after changes

**Solution:**
```bash
# Stop the server (Ctrl+C), clean build files, and restart
bundle exec jekyll clean
./dev-server.sh
```

## 🔄 Permanent Ruby Path Setup (Optional)

To avoid setting the Ruby path every time, add this to your `~/.zshrc`:

```bash
# Add to ~/.zshrc
export PATH="/opt/homebrew/opt/ruby/bin:$PATH"
export PATH="/opt/homebrew/lib/ruby/gems/3.4.0/bin:$PATH"
```

Then reload your shell:
```bash
source ~/.zshrc
```

## 📦 Project Structure

```
portfolio/
├── _config.yml              # Jekyll configuration
├── _includes/               # Reusable HTML components
├── _layouts/                # Page templates
├── _projects/               # Project markdown files
├── _posts/                  # Blog posts
├── _site/                   # Generated site (git-ignored)
├── admin/                   # Netlify CMS
├── assets/                  # CSS, JS, Sass
├── images/                  # Project images
├── dev-server.sh           # Development server script
└── index.html               # Main homepage
```

## 🚀 Deployment

Your portfolio is configured for GitHub Pages:

- **Repository:** `mahadishere/portfolio`
- **Branch:** `master`
- **URL:** `https://mahadishere.github.io/portfolio`

Changes pushed to the `master` branch automatically deploy to GitHub Pages.

## 📚 Additional Resources

- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [Liquid Templating](https://shopify.github.io/liquid/)
- [GitHub Pages](https://docs.github.com/en/pages)
- [Netlify CMS](https://decapcms.org/docs/)

## 🎯 Performance Tips

1. **Use lazy loading for images:** Already implemented with `loading="lazy"`
2. **Optimize images:** Compress images before adding them
3. **Test build time:** Run `bundle exec jekyll build --profile` to see what's slow
4. **Cache gems:** Keep `vendor/bundle` for faster subsequent builds

## 💡 Pro Tips

- The site uses **single-page navigation** with anchor links
- **Dark mode** is managed via localStorage
- **Project filtering** is client-side JavaScript
- Images should go in `/images/ProjectName/` folders
- Use `{{ '/path' | relative_url }}` for all internal links

---

**Happy coding! 🎨✨**

For questions or issues, refer to the `.cursorrules` file for architectural patterns and conventions.

