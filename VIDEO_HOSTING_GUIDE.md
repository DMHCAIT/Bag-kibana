# 🎥 Video Hosting Guide for Hero Section

## Why Videos Are Not in Git

Your video files were removed from the repository because:
1. **Desktop video**: 0 bytes (empty/corrupted file)
2. **Mobile video**: 58MB (exceeds GitHub's 50MB recommended limit)

Large video files should NOT be stored in Git. Use a CDN or cloud storage instead.

---

## ✅ Recommended Solutions

### Option 1: Vercel Blob Storage (Recommended for Vercel deployments)

**Pros**: 
- Integrated with Vercel
- Automatic optimization
- Free tier: 100GB transfer/month
- Global CDN

**Steps**:
1. Go to your Vercel project dashboard
2. Click **Storage** → **Blob** → **Create Database**
3. Install Vercel Blob SDK:
   ```bash
   npm install @vercel/blob
   ```
4. Upload videos using Vercel dashboard or API
5. Get public URLs and update `HeroSection.tsx`

**Documentation**: https://vercel.com/docs/storage/vercel-blob

---

### Option 2: Cloudinary (Best for video optimization)

**Pros**:
- Automatic video compression
- Format conversion (MP4, WebM)
- Free tier: 25GB storage, 25GB bandwidth/month
- Responsive video delivery

**Steps**:
1. Sign up at https://cloudinary.com/
2. Upload videos via dashboard
3. Get video URLs
4. Update `HeroSection.tsx` with URLs

**Documentation**: https://cloudinary.com/documentation/video_manipulation_and_delivery

---

### Option 3: Compress Videos First

If you want to keep videos in Git, compress them first:

**Using HandBrake** (Free):
1. Download: https://handbrake.fr/
2. Open your video
3. Settings:
   - Preset: "Web" → "Fast 1080p30"
   - Video Codec: H.264
   - Quality: RF 24-28 (smaller number = better quality)
   - Frame Rate: 30fps
4. Save (target: under 10MB for each video)

**Using FFmpeg** (Command line):
```bash
# Desktop video - compress to ~5MB
ffmpeg -i "homepage hero section.mp4" -vcodec h264 -crf 28 -preset fast -vf scale=1920:-2 public/videos/hero-desktop.mp4

# Mobile video - compress to ~5MB  
ffmpeg -i "Kiabana reel- mobile version 2 (1).mp4" -vcodec h264 -crf 28 -preset fast -vf scale=1080:-2 public/videos/hero-mobile.mp4
```

---

## 📝 How to Add Videos to Hero Section

Once you have video URLs (from Vercel Blob, Cloudinary, etc.):

### 1. Edit `components/HeroSection.tsx`

Find the commented video sections and uncomment them:

```tsx
// Replace YOUR_DESKTOP_VIDEO_URL_HERE with actual URL
<video
  autoPlay
  loop
  muted
  playsInline
  className="hidden md:block absolute inset-0 w-full h-full object-cover"
>
  <source src="https://res.cloudinary.com/YOUR_ACCOUNT/video/upload/hero-desktop.mp4" type="video/mp4" />
</video>

// Replace YOUR_MOBILE_VIDEO_URL_HERE with actual URL
<video
  autoPlay
  loop
  muted
  playsInline
  className="md:hidden absolute inset-0 w-full h-full object-cover"
>
  <source src="https://res.cloudinary.com/YOUR_ACCOUNT/video/upload/hero-mobile.mp4" type="video/mp4" />
</video>
```

### 2. Remove the placeholder section

Delete the placeholder div with instructions once videos are added.

---

## 🚀 Quick Fix: Use YouTube/Vimeo

If you don't want to deal with hosting:

1. Upload videos to YouTube or Vimeo
2. Get embed URLs
3. Use `<iframe>` instead of `<video>`

**Example**:
```tsx
<iframe
  src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1&mute=1&loop=1&playlist=YOUR_VIDEO_ID&controls=0"
  className="absolute inset-0 w-full h-full"
  allow="autoplay"
  frameBorder="0"
/>
```

---

## 📊 Video Optimization Tips

For best performance:
- **Resolution**: 1920x1080 (desktop), 1080x1920 (mobile)
- **Format**: MP4 (H.264 codec)
- **File size**: Under 5MB each
- **Frame rate**: 30fps
- **Compression**: CRF 24-28 (FFmpeg)
- **Audio**: Remove audio track (not needed for hero videos)

---

## ⚠️ Current Status

- ✅ Hero section configured to display videos
- ❌ Videos not hosted (need to upload to CDN)
- ✅ Placeholder showing with instructions
- ✅ Code ready - just add URLs when videos are hosted

---

## 🆘 Need Help?

- **Vercel Blob**: https://vercel.com/docs/storage/vercel-blob/quickstart
- **Cloudinary**: https://cloudinary.com/documentation/video_optimization
- **FFmpeg**: https://ffmpeg.org/ffmpeg.html

Once videos are hosted, just update the URLs in `HeroSection.tsx` and redeploy!
