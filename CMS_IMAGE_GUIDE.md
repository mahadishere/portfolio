# 📸 CMS Image Organization Guide

## Current Setup

The CMS stores all images in the `/images/` folder. Images are organized by project in subfolders:
- `images/360Lens/`
- `images/Hotsping/`
- `images/SolidVR/`
- etc.

## How to Use Images in CMS

### Selecting Existing Images

1. **Click "Choose an image"** in the CMS
2. The image picker will show **all images** from the `/images/` folder
3. **Navigate folders** by clicking on folder names in the image picker
4. Select the image you want

**Note:** The CMS image picker shows folders, but they may appear as a flat list. Look for folder names or navigate by typing the path.

### Image Path Format

When selecting images, use the full path including the folder:
- ✅ `images/360Lens/360lens1.png`
- ✅ `images/Hotsping/01.png`
- ❌ `360lens1.png` (missing folder)

### Uploading New Images

**Current Limitation:** New images uploaded via CMS go to the root `/images/` folder.

**Workaround Options:**

**Option 1: Manual Organization (Recommended)**
1. Upload image via CMS (it goes to `/images/`)
2. Manually move the file to the correct project folder (e.g., `images/360Lens/`)
3. Update the image path in CMS to include the folder

**Option 2: Upload Directly to Folder**
1. Manually add images to the project folder (e.g., `images/360Lens/`)
2. In CMS, select "Choose an image" and navigate to that folder
3. Select the image

**Option 3: Use File System**
1. Add images directly to the project folder using your file system
2. In CMS, reference them with the full path: `images/ProjectName/filename.png`

## Best Practice

1. **Organize images by project** in folders: `images/ProjectName/`
2. **Use descriptive filenames**: `screenshot-01.png`, `demo-view.png`
3. **Keep thumbnails small** (~400x300px) for card images
4. **Gallery images can be larger** but optimize for web

## Folder Structure

```
images/
├── 360Lens/
│   ├── 360lens1.png
│   ├── 360lens3.png
│   └── ...
├── Hotsping/
│   ├── 01.png
│   └── ...
├── SolidVR/
│   └── ...
└── ...
```

## Tips

- The CMS image picker may show all images in a flat list
- You can type the path manually: `images/ProjectName/filename.png`
- Always include the folder name in the path
- Keep project folders organized for easier management

