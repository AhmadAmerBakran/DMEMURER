# DME website media guide

The `god-design-construction-motion` branch is already wired for the media below. Use the exact paths and filenames so no code changes are needed beyond enabling the hero video sources.

## 1. Hero banner video

Add both formats when possible:

- `assets/video/hero-banner.webm`
- `assets/video/hero-banner.mp4`

Recommended master export:

- Resolution: **1920 × 1080 px**
- Aspect ratio: **16:9**
- Duration: **8–15 seconds**
- Frame rate: **24–30 fps**
- Audio: **no audio / muted**
- Composition: keep the most important action in the **center 60%** because mobile uses a tighter crop
- Target size: ideally **under 8 MB per format**
- WebM: **VP9 or AV1**
- MP4: **H.264**

After adding the files, open `index.html` and uncomment the two `<source>` lines inside `.dme-hero__video`:

```html
<source src="/assets/video/hero-banner.webm" type="video/webm">
<source src="/assets/video/hero-banner.mp4" type="video/mp4">
```

The animated construction scene remains as a designed fallback, so the hero still looks intentional if the video is unavailable or motion is reduced.

### Optional hero poster

If you want a poster frame while the video initializes:

- Filename: `assets/images/hero-poster.webp`
- Resolution: **1920 × 1080 px**
- Format: **WebP**
- Target size: ideally **under 300 KB**

Only add a `poster="/assets/images/hero-poster.webp"` attribute to the hero `<video>` after this file exists, to avoid an unnecessary 404 request.

## 2. Service images

Use landscape **3:2** WebP images.

Recommended export:

- Resolution: **1800 × 1200 px**
- Format: **WebP**
- Target size: ideally **under 350 KB each**
- Crop safety: keep the subject inside the **center 80%** of the frame

Exact filenames:

- `assets/images/services/service-nybyggeri.webp`
- `assets/images/services/service-fliser-klinker.webp`
- `assets/images/services/service-badevaerelser.webp`
- `assets/images/services/service-facader-fuger.webp`
- `assets/images/services/service-renovering.webp`
- `assets/images/services/service-tilbygning.webp`
- `assets/images/services/service-reparationer.webp`

Until each image exists, the service card displays its built-in construction/blueprint placeholder instead of a broken image.

## 3. Social sharing image

- Filename: `assets/images/og-dme.jpg`
- Exact resolution: **1200 × 630 px**
- Recommended target size: **under 400 KB**

## 4. Logo

The site currently uses:

- `assets/images/dme-logo.webp`

Keep the logo on a transparent or black-compatible background and avoid adding extra empty padding around it. The layout handles responsive sizing automatically.
