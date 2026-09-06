# DME website media guide

The website is already wired for the media below. Use these exact paths and names.

## Hero banner video

Add both formats when possible:

- `assets/video/hero-banner.webm`
- `assets/video/hero-banner.mp4`

Recommended master:

- Resolution: **1920 × 1080 px**
- Aspect ratio: **16:9**
- Duration: **8–15 seconds**
- Frame rate: **24–30 fps**
- Audio: **no audio / muted**
- Target size: ideally **under 8 MB per format**
- WebM: VP9 or AV1
- MP4: H.264

After adding the files, open `index.html` and uncomment the two `<source>` lines inside `.hero-video`.

Optional poster image:

- `assets/images/hero-poster.webp`
- Recommended: **1920 × 1080 px**, WebP, ideally under 300 KB

## Service images

Use **WebP**, landscape **3:2**, recommended **1800 × 1200 px**. Keep each file ideally under **350 KB**.

Exact filenames:

- `assets/images/services/service-nybyggeri.webp`
- `assets/images/services/service-fliser-klinker.webp`
- `assets/images/services/service-badevaerelser.webp`
- `assets/images/services/service-facader-fuger.webp`
- `assets/images/services/service-renovering.webp`
- `assets/images/services/service-tilbygning.webp`
- `assets/images/services/service-reparationer.webp`

Until each image is added, the site displays a designed construction-style placeholder instead of a broken image.

## Social sharing image

- `assets/images/og-dme.jpg`
- Exact size: **1200 × 630 px**
