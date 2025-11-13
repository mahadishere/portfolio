# 📝 Netlify CMS Guide - Project Management

## 🎯 Overview

Your portfolio now uses a **multi-dimensional taxonomy system** that makes it easy to categorize projects by:
- **XR Technology** (AR, VR, MR, XR)
- **Industry Domain** (Medical, Manufacturing, Commercial, etc.)
- **Project Type** (Game, App, R&D, Computer Vision, AI/ML, Tool)
- **Platform** (HoloLens, Quest, Mobile, Desktop, etc.)

All of these can be managed through the **Netlify CMS** interface at `/admin`.

---

## 🚀 Accessing the CMS

1. Navigate to: `https://mahadishere.github.io/portfolio/admin`
2. **Login** with your GitHub credentials
3. You'll see the CMS dashboard

---

## ➕ Adding a New Project

### Step 1: Create New Project

1. In the CMS, click **"Projects"** in the left sidebar
2. Click **"New Project"** button
3. Fill in the required fields

### Step 2: Fill Project Information

#### **Basic Information (Required)**

| Field | Description | Example |
|-------|-------------|---------|
| **Title** | Project name | `360Lens (AR)` |
| **Anchor ID** | Unique URL identifier (lowercase, no spaces) | `360lens` |
| **Card Image** | Thumbnail for project grid | `images/360Lens/360lens3.png` |
| **Summary** | Brief description (2-3 sentences) | `HoloLens 2-based pre-surgical planning tool` |

#### **Taxonomy Fields (Optional but Recommended)**

##### **XR Technology** (Single Selection)
Choose ONE technology:
- **AR** - Augmented Reality projects
- **VR** - Virtual Reality projects  
- **MR** - Mixed Reality projects
- **XR** - General Extended Reality

##### **Industry Domain** (Multiple Selection ✓)
You can select **multiple** domains:
- **Medical / Healthcare** - Healthcare, medical imaging, surgical planning
- **Manufacturing / CAD** - Industrial design, CAD integration
- **Retail / Commercial** - Product visualization, e-commerce
- **Education** - Educational tools and applications
- **Entertainment** - Games, entertainment experiences

##### **Project Type** (Multiple Selection ✓)
You can select **multiple** types:
- **Game** - Video games and interactive entertainment
- **Application** - Standalone applications
- **Research & Development** - R&D, experimental projects
- **Computer Vision** - CV, image processing, tracking
- **AI/ML** - Artificial intelligence and machine learning
- **Tool/Utility** - Development tools, utilities

##### **Platform** (Single Selection)
Choose ONE primary platform:
- **HoloLens** - Microsoft HoloLens (1 or 2)
- **Quest** - Meta Quest headsets
- **PCVR** - PC-based VR (Vive, Index, etc.)
- **Mobile** - iOS or Android
- **Web** - Browser-based
- **Desktop** - PC/Mac desktop application
- **Cross-Platform** - Multiple platforms supported

##### **Featured Project** (Toggle)
- Toggle **ON** to mark as a featured/highlight project
- Featured projects display a ★ gold star badge
- Use for your best or most important work

#### **Additional Fields**

| Field | Description | Required? |
|-------|-------------|-----------|
| **Tags** | Additional keywords (click "+ Add Tags") | Optional |
| **External URL** | Link to demo, Steam, YouTube, etc. | Optional |
| **External Label** | Text for the link (e.g., "Live Demo", "YouTube Video") | Optional |
| **Content** | Full project description (Markdown supported) | Optional |

### Step 3: Save & Publish

1. Click **"Publish"** in the top right
2. Or click **"Save"** to save as draft (not published)
3. Changes commit to GitHub automatically
4. Site rebuilds and deploys within 2-5 minutes

---

## ✏️ Editing Existing Projects

1. Go to **"Projects"** in CMS sidebar
2. Click on the project you want to edit
3. Make your changes
4. Click **"Publish"** or **"Update"**
5. Changes deploy automatically

---

## 🎨 Category Examples

### Example 1: Medical AR Project

```yaml
Title: 360Lens (AR)
Anchor ID: 360lens
XR Technology: AR
Domain: 
  - Medical / Healthcare
Project Type:
  - Application
  - Research & Development
  - Computer Vision
Platform: HoloLens
Featured: ✓ Yes
```

### Example 2: VR Game

```yaml
Title: Zombie Tag Royale (Game)
Anchor ID: ztr
XR Technology: (leave empty if not XR)
Domain:
  - Entertainment
Project Type:
  - Game
Platform: Desktop
Featured: No
```

### Example 3: Multi-Domain Tool

```yaml
Title: DICOM Measurement Tools
Anchor ID: dicom
XR Technology: (leave empty)
Domain:
  - Medical / Healthcare
  - Education
Project Type:
  - Tool/Utility
  - Computer Vision
Platform: Desktop
Featured: ✓ Yes
```

---

## 🎯 Best Practices

### ✅ DO's

- ✅ **Use multiple domains/types** when applicable (e.g., Medical + Education)
- ✅ **Mark your best work** as Featured (3-5 projects recommended)
- ✅ **Add meaningful tags** for better searchability
- ✅ **Include external links** to demos, videos, or live versions
- ✅ **Write clear summaries** (think elevator pitch)
- ✅ **Organize images** in project-specific folders: `/images/ProjectName/`

### ❌ DON'Ts

- ❌ Don't use special characters in Anchor IDs (use `my-project`, not `My Project!`)
- ❌ Don't mark ALL projects as Featured (defeats the purpose)
- ❌ Don't leave Title or Summary empty
- ❌ Don't use absolute image paths (use relative: `images/...`)

---

## 🔍 How Filtering Works

When visitors use your portfolio:

1. **Dropdown Filters** allow selecting by XR Tech, Domain, or Type
2. **Multiple categories** mean projects appear in multiple filter results
3. **AND Logic** - All selected filters must match
4. **Search box** searches across title, summary, and tags
5. **Reset button** clears all active filters

**Example:**
- Filter: `AR` + `Medical` → Shows only AR projects in Medical domain
- Filter: `Game` → Shows all games regardless of domain
- Search: "planning" → Shows projects with "planning" in title/summary

---

## 📸 Adding Images

### Via CMS

1. When editing a project, click the **"Card Image"** field
2. Click **"Choose an image"**
3. Upload a new image OR select from existing
4. Images save to `/images/` folder
5. Manually organize into project folders later

### Manual Method (Recommended)

1. Create folder: `/images/YourProjectName/`
2. Add images to that folder
3. In CMS, set path: `images/YourProjectName/thumbnail.png`

---

## 🆕 Adding New Categories

### To Add a New Domain (e.g., "Architecture")

Edit `/admin/config.yml`:

```yaml
- label: "Industry Domain"
  name: "domain"
  widget: "select"
  multiple: true
  options: 
    - {label: "Medical / Healthcare", value: "Medical"}
    - {label: "Manufacturing / CAD", value: "Manufacturing"}
    - {label: "Architecture", value: "Architecture"}  # ← NEW
```

Then update `index.html` dropdown:

```html
<select id="filter-domain" class="filter-dropdown">
  <option value="all">All Domains</option>
  <option value="Medical">Medical / Healthcare</option>
  <option value="Architecture">Architecture</option>  <!-- NEW -->
</select>
```

**Note:** After adding new categories, you may need to rebuild the site or clear cache.

---

## 🧪 Testing Your Changes

After publishing through CMS:

1. Wait 2-5 minutes for GitHub Pages to rebuild
2. Visit your live site: `https://mahadishere.github.io/portfolio`
3. Test the new project in the **Projects** section
4. Try filtering by the categories you selected
5. Verify images load correctly
6. Check mobile responsiveness

---

## 🐛 Troubleshooting

### Problem: Project doesn't appear in filters

**Solution:** Check that taxonomy fields are set correctly in CMS. Values are case-sensitive.

### Problem: Image doesn't load

**Solution:** Verify image path is relative: `images/ProjectName/file.png` (no leading `/`)

### Problem: Featured badge not showing

**Solution:** Ensure "Featured Project" toggle is ON in CMS

### Problem: Can't login to CMS

**Solution:** Verify GitHub OAuth is configured correctly. Check Vercel deployment.

---

## 📚 Additional Resources

- **Live Portfolio:** https://mahadishere.github.io/portfolio
- **CMS Access:** https://mahadishere.github.io/portfolio/admin
- **GitHub Repo:** https://github.com/mahadishere/portfolio
- **Architecture Docs:** `.cursorrules` file in project root

---

## 🎓 Quick Reference

### Taxonomy Quick Pick

| Project Type | Suggested Taxonomy |
|--------------|-------------------|
| **HoloLens Medical App** | AR + Medical + App + HoloLens |
| **Unity VR Game** | VR + Entertainment + Game + PCVR |
| **Computer Vision Tool** | CV + Tool + Desktop |
| **AR Product Viewer** | AR + Commercial + App + Mobile |
| **CAD Integration** | VR + Manufacturing + Tool + PCVR |

---

**Happy project managing! 🚀**

For questions or issues, refer to the `.cursorrules` file for technical details.

