# CLS 63 — Quiet luxury. Brutal presence.

A single-page, dark editorial showcase for the Mercedes-AMG CLS 63 S.
This is an independent concept site and not an official Mercedes-Benz website.

## Stack

- React 19 + TypeScript + Vite
- **Lenis**: the only smooth-scroll layer, driven by GSAP's ticker (`autoRaf: false`)
- **GSAP + ScrollTrigger** (`@gsap/react` `useGSAP`): handles all scroll choreography
- **React Bits ScrollReveal**: used once, on the intro paragraph (`src/components/reactbits/`)
- Plain, organised CSS in `src/index.css`. Fonts are bundled locally: Archivo Variable (width axis) and IBM Plex Mono.

## Live site

Every push to `main` builds the site and publishes it with GitHub Pages (see `.github/workflows/deploy.yml`).
In the repo's **Settings → Pages**, set **Source** to **GitHub Actions** once.

## Setup

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # production build → dist/
npm run build:single   # one self-contained HTML file → dist-single/index.html
```

## Adding photographs

**Quickest:** `npm run images`. This downloads 8 freely licensed CLS 63 (C218) photos from Wikimedia Commons, then crops them and gives them all one dark monochrome grade. The results go in `src/assets/cls63/`, ready for `npm run dev`. Credits appear automatically in the footer, as the CC licences require. Use `npm run images -- --force` to re-download.

To use your own photos instead, put the files in `src/assets/cls63/` using these exact names (`.jpg`, `.png`, `.webp` or `.avif` all work).
Any slot without a file shows a labelled placeholder, so the page never shows a broken image.

| File | What to shoot | Size |
|---|---|---|
| `hero` | Front three-quarter, low angle, dark studio | 2400 × 1350 |
| `profile` | Full side profile, level camera, long lens | 2400 × 1350 |
| `headlight` | Front detail: headlamp and grille | 2400 × 1350 |
| `rear` | Rear and exhaust detail, low angle | 2400 × 1350 |
| `engine` | Engine bay or AMG engine cover, portrait | 1200 × 1500 |
| `pause` | Wide atmospheric shot with the car small in frame | 2400 × 1200 |
| `wheel` | Wheel and brake caliper detail, portrait | 1200 × 1500 |
| `interior` | Interior detail: wheel, seats or trim | 1600 × 1200 |

Every photo should show the same car and model year: the specs and the light trace are set up for a **2013 CLS63 AMG**. `scripts/process_photos.py` cuts the car out of each photo, puts it on black and grades the paint to black.
For responsive images, add smaller copies next to each original, such as `hero-1200w.jpg` and `hero-800w.jpg`. They are added to `srcset` automatically.

If an image's dimensions differ from the table, update `width`/`height` in `src/data/site.ts`. Those values reserve the layout space.

## Editing content

All copy, captions, alt text, image focal points and specs live in **`src/data/site.ts`**.

### Specifications

These cover the exact car in the photographs: **2013 Mercedes-Benz CLS63 AMG with the AMG Performance Package, US specification**.

| Figure | Value | Source |
|---|---|---|
| Output | 550 hp | MBUSA, CLS63 AMG release and equipment list |
| Torque | 590 lb-ft | MBUSA |
| 0–60 mph | 4.3 s | MBUSA equipment list |
| Top speed | 186 mph (electronically limited) | MBUSA equipment list |
| Engine | 5.5 L V8 biturbo, 5,461 cc | MBUSA |
| Transmission | AMG SPEEDSHIFT MCT 7-speed, rear-wheel drive | MBUSA |

## Structure

```
src/
  data/site.ts              ← all editable content
  lib/smooth-scroll.tsx     ← single Lenis instance + GSAP ticker + anchor scrolling
  lib/assets.ts             ← resolves image slots / srcset at build time
  components/
    Nav.tsx                 fixed nav, progress bar, active section
    Hero.tsx                entrance timeline + scroll parallax
    Intro.tsx               masked line reveal (GSAP) + ScrollReveal paragraph (React Bits)
    LightTrace.tsx          pinned headlight-to-taillight light trace (signature sequence)
    Performance.tsx         count-up figures, technical spread
    VisualPause.tsx         clipped parallax image
    Gallery.tsx, Lightbox.tsx  asymmetric gallery + accessible lightbox
    Closing.tsx             closing type, footer, disclaimer
    AssetImage.tsx          image or labelled placeholder
    reactbits/ScrollReveal.tsx
```

## Motion and accessibility notes

- Lenis and ScrollTrigger share one loop: `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))` and `lagSmoothing(0)`. Everything is cleaned up on unmount.
- The light trace pins for about 3 viewports on desktop and 1.7 on mobile. Its SVG path uses the side-profile photo's own pixel coordinates and sits in the same box as the photo, so they stay aligned at every size. If you replace `profile.jpg`, re-trace `design.trace.path` in `site.ts`.
- With `prefers-reduced-motion: reduce`, Lenis is skipped, nothing pins, there is no parallax, the light trace is shown complete, and all content stays visible.
- All content is in the HTML before JavaScript runs. Animations use `gsap.from`, so nothing depends on them finishing.
- No element is animated by two libraries. GSAP handles headings and React Bits handles only the intro paragraph.
