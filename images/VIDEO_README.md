# Intro Video Animation

The home page intro section now uses a video animation instead of a static image.

## Video File Requirements

Place your video file(s) in the `/images/` directory with these names:

- **Primary**: `intro-video.mp4` (MP4 format, recommended)
- **Fallback**: `intro-video.webm` (WebM format, optional but recommended for better browser compatibility)

## Video Specifications

For best results, your video should:
- Be optimized for web (compressed)
- Have a reasonable file size (ideally under 5-10MB)
- Use a 16:9 or similar aspect ratio
- Be short and loopable (5-15 seconds works well)
- Have no audio track (or audio will be muted automatically)

## Fallback

If the video cannot be loaded or the browser doesn't support video, the original image (`me.png`) will be displayed as a fallback.

## Video Attributes

The video is configured with:
- `autoplay` - Starts playing automatically
- `loop` - Loops continuously
- `muted` - Muted by default (required for autoplay in most browsers)
- `playsinline` - Plays inline on mobile devices

## Adding via CMS

You can upload video files through Netlify CMS to the `/images/` folder, just like images.

