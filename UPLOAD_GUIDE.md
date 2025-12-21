# Complete Upload Guide - Admin Frontend Posting

## ✅ What You Need to Upload

You need to upload **2 files** to your cPanel:

### File 1: check_admin_session.php
**From:** `C:\Users\HP\.gemini\antigravity\scratch\apc-enugu-2027\api\check_admin_session.php`
**To:** `/public_html/api/check_admin_session.php`

### File 2: script.js  
**From:** `C:\Users\HP\.gemini\antigravity\scratch\apc-enugu-2027\script.js`
**To:** `/public_html/script.js`

---

## 📝 Step-by-Step Upload Instructions

### Step 1: Open cPanel File Manager
1. Go to `https://yourdomain.com/cpanel`
2. Login
3. Click **File Manager**

### Step 2: Upload check_admin_session.php
1. Navigate to `/public_html/api`
2. Click **Upload**
3. Select `C:\Users\HP\.gemini\antigravity\scratch\apc-enugu-2027\api\check_admin_session.php`
4. Wait for upload to complete

### Step 3: Upload script.js
1. Navigate back to `/public_html`
2. Find existing `script.js`
3. **Right-click** → **Delete** (or rename to `script.js.old`)
4. Click **Upload**
5. Check **"Overwrite existing files"**
6. Select `C:\Users\HP\.gemini\antigravity\scratch\apc-enugu-2027\script.js`
7. Wait for upload

---

## 🧪 Testing Steps

### Test 1: Login to Backend
1. Go to `https://apcgat2027enugu.com.ng/admin`
2. Login with admin credentials
3. You should see admin dashboard

### Test 2: Check Frontend Button
1. Open new tab: `https://apcgat2027enugu.com.ng`
2. Hard refresh: **Ctrl + Shift + R**
3. You should see a green **"Create Post"** button floating at bottom-right corner
4. If you don't see it, open Console (F12) and check for errors

### Test 3: Create a Post
1. Click the green "Create Post" button
2. Fill in:
   - Post Type: Announcement
   - Title: Test Post
   - Content: This is a test
3. Click **Publish Post**
4. Post should appear in forum immediately

### Test 4: Logout Test
1. Go to `https://apcgat2027enugu.com.ng/admin/logout.php`
2. Return to homepage
3. Green button should **disappear**

---

## ❌ Troubleshooting

### Button not showing?
1. Open browser console (F12 → Console)
2. Look for errors mentioning:
   - `checkBackendAdminSession`
   - `check_admin_session.php`
   - CORS errors
3. Screenshot and send to me

### Can't create posts?
1. Check if you're logged in to `/admin` first
2. Try logging out  and back in
3. Clear browser cache

### API errors?
1. Check `api/check_admin_session.php` was uploaded
2. Check file permissions (should be 644)

---

## 🎯 How It Works

```
1. Admin logs in at /admin/index.php
      ↓
2. PHP creates session with admin_id
      ↓
3. Admin goes to homepage
      ↓
4. JavaScript calls api/check_admin_session.php
      ↓
5. API checks if session exists
      ↓
6. If YES → Show green "Create Post" button
   If NO → Button stays hidden
```

---

## ✨ What Admin Can Do

✅ Login via `/admin`
✅ See green "Create Post" button on homepage
✅ Click button to open post creation form
✅ Create posts with title, content, images
✅ Posts appear immediately on frontend
✅ Author name auto-filled from backend session

❌ Regular visitors **cannot** see the button
❌ Regular visitors **cannot** create posts
❌ Only backend-authenticated admins can post
