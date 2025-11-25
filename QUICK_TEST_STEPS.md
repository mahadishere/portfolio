# ⚡ Quick Performance Test Steps

## 🎯 3-Minute Test (Before Every Publish)

### Step 1: Open DevTools with Throttling (1 min)

1. **Open your site** in Chrome/Edge
2. **Press F12** (or Cmd+Option+I on Mac)
3. **Go to Network tab**
4. **Click throttling dropdown** (top toolbar, says "No throttling")
5. **Select "Slow 3G"** (simulates real slow connection)

### Step 2: Reload and Check (1 min)

1. **Press Cmd+R** (or Ctrl+R) to reload
2. **Watch the Network tab:**
   - Look at the **total time** (bottom of tab)
   - Check **file sizes** (should see KB/MB)
   - Count **number of requests** (left side)

3. **Check these numbers:**
   - ✅ Total load time < 10 seconds (on Slow 3G)
   - ✅ Total page size < 5MB
   - ✅ Number of requests < 40

### Step 3: Run Lighthouse (1 min)

1. **In DevTools, go to Lighthouse tab**
2. **Check:**
   - ✅ Performance
   - ✅ Desktop (or Mobile)
3. **Click "Analyze page load"**
4. **Wait for results**

**Good scores:**
- ✅ Performance: 80+ (green)
- ✅ First Contentful Paint: < 2.5s
- ✅ Largest Contentful Paint: < 4s

## 🚨 Red Flags (Stop and Fix Before Publishing)

If you see:
- ❌ Any file > 1MB loading on page load
- ❌ Total load time > 15 seconds (Slow 3G)
- ❌ Lighthouse score < 70
- ❌ Background music loading immediately (check Network tab)

## 📊 What Good Looks Like

**On Slow 3G:**
- Total load: 6-10 seconds
- First paint: 2-3 seconds
- Lighthouse: 80+ score

**On Fast 3G:**
- Total load: 3-5 seconds
- First paint: 1-2 seconds
- Lighthouse: 85+ score

## 💡 Pro Tip

**Test in Incognito Mode:**
- Cmd+Shift+N (Chrome) or Cmd+Shift+P (Firefox)
- No extensions or cache interference
- More accurate results

---

**That's it!** If these checks pass, you're good to publish. 🚀

