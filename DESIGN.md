# Design specs

> **Quiet luxury. Brutal presence.**
> A digital exhibition for one car. The car is always the subject, and everything else stays out of its way.

---

## Principles

1. **The car leads.** Effects that pull the eye away from the vehicle don't belong.
2. **Space is the luxury.** Generous negative space, thin rules, few words.
3. **One great moment beats ten good ones.** The light trace is the centrepiece. Everything else is restrained.
4. **Motion is slow and precise.** It follows the scroll and never fights it.
5. **Content never waits on JavaScript.** Animations only add to a page that already works.

## Colour

| Token | Value | Use |
|---|---|---|
| `--bg` | `#080808` | Page background, and the photo backgrounds |
| `--bg-2` | `#111111` | Image wells and placeholders |
| `--text` | `#F1F1ED` | Primary text, warm off-white |
| `--muted` | `#8B8B88` | Labels, captions, secondary copy |
| `--line` | `rgba(241,241,237,.12)` | Rules and borders |
| `--line-soft` | `rgba(241,241,237,.07)` | Hairlines |
| `--accent` | `#7A1418` | Deep red, used only for tiny marks (section dots, active nav dot) |
| Trace red | `#C0242B → #FF3B3B` | Only the end of the light trace and the taillight glow |

Red appears in exactly three places: the 4px section markers, the active nav dot, and the end of the light trace with the taillight glow.

## Typography

| Role | Font | Settings |
|---|---|---|
| Display | Archivo Variable | weight 600–700, width 112–125% (expanded), tracking −0.035 to −0.055em, line-height 0.8–0.95 |
| Body | Archivo Variable | weight 380, width 100%, line-height 1.55 |
| Labels / annotations | IBM Plex Mono | 11px, uppercase, letter-spacing 0.16–0.18em |

**Fluid scale** (all `clamp()`):

| Token | Range |
|---|---|
| `--fs-hero` | 5.5rem → 26rem (23vw) |
| `--fs-display-l` | 2.75rem → 8rem |
| `--fs-display-m` | 2.1rem → 4.75rem |
| `--fs-body` | 1.05rem → 1.35rem |

Huge display type sits against tiny mono annotations. That contrast is the typographic idea of the whole site.

## Layout

- **Gutter:** `clamp(1.25rem, 4vw, 4rem)`. **Section spacing:** `clamp(6rem, 16vw, 14rem)`.
- **12-column grid** for the editorial sections. Text rarely spans more than 6 columns.
- **Section head:** `01 ▪ ──────────── OVERVIEW`, with a number, a hairline rule and a mono label.
- **Square corners** everywhere. No cards, shadows or glassmorphism, apart from a light blur on the solid nav.
- **Breakpoints:** 900px (pinning on/off, two columns to one), 760px (gallery stacks), 520px (nav compacts).

## Photography

- **One car, one year:** a 2013 CLS63 AMG, every shot.
- **Black on black:** the background is removed and replaced with `#080808`, with a soft ground shadow under the car.
- **Paint graded to black:** luminance is crushed (`lum^2.1 × 0.95`) so specular highlights survive as reflections.
- **Red kept on purpose:** strongly red pixels (calipers, taillights) keep a restrained red.
- **Privacy:** the licence plate in the rear photo is blanked out.

Processing lives in `scripts/process_photos.py`. The *Prepare photos* GitHub workflow runs it end to end.

## Motion

**Stack:** Lenis (smoothing) → GSAP ticker → ScrollTrigger. One loop and one Lenis instance.

| Kind | Feel | Example |
|---|---|---|
| Entrance | 1–1.6s, `expo.out` / `power3.out`, short staggers | Hero type rising from a mask |
| Reveal | Plays once at about 80% of the viewport | Headlines, table rows, gallery wipes |
| Scrubbed | Tied to scroll and reverses naturally | Parallax, the light trace |

**Rules**
- Animate `transform` and `opacity`, with `clip-path` for wipes only.
- One library per element. GSAP owns the headings, and React Bits owns the intro paragraph only.
- Use `gsap.from()` so the resting state is the real state.
- Every effect sits inside `gsap.matchMedia()`. Under `prefers-reduced-motion: reduce`, Lenis is off, nothing pins, there's no parallax, and the trace is shown complete.

## Sections

### 01 · Hero
Full viewport. The bonnet photo is set behind `CLS 63` at `--fs-hero`. The entrance scales the image from 1.08 to 1 while the type rises. On scroll, the photo drifts down 12% while the type rises 35%, and the copy fades out by 45%.

### 02 · Overview
"Presence, without permission." is revealed line by line. Beside it, the paragraph un-blurs word by word as you scroll (React Bits `ScrollReveal`).

### The light trace
*The signature moment.*

**Composition:** the side-profile photo (1200 × 742) and an SVG overlay share one box with `aspect-ratio: 1200 / 742`. The SVG's `viewBox` uses the photo's own pixel units. The photo uses `object-fit: fill` and is never cropped, so the path stays locked to the bodywork at any screen size.

**The path:** it starts at the headlight's rear corner (132, 424), follows the front wing and the door shoulder at y ≈ 412–424, then rises across the rear haunch into the taillight's leading edge (1106, 406):

```
M 132 424 C 200 410, 300 404, 400 412
          C 520 420, 700 424, 860 424
          C 960 423, 1040 412, 1106 406
```

**Stroke:** a 1.6px non-scaling core plus a 5px blurred glow. A horizontal gradient runs from silver (`#E9E9E4`) to red (`#C0242B`), starting at x = 980. A bright tip follows the end of the line.

**Choreography** (scrubbed, pinned for about 3 viewports on desktop and 1.7 on mobile):

| Progress | Event |
|---|---|
| 0 → 0.18 | Headlight glow blooms and the photo lifts to 85% |
| 0.12 → 1.12 | The line draws front to rear. The captions *The stare. → The silhouette. → The final impression.* change in step |
| 1.10 | The tip fades, the headlight dims and the taillight glows red |
| 1.18 | **"Every line has intent."** appears |
| → 1.6 | Hold, then release |

**If you change the photo,** re-trace `path`, `head` and `tail` in `site.ts`. Overlaying the path on the image with a grid is the quickest way.

### 03 · Performance
A technical editorial spread. Three large figures with tabular numbers count up once, beside a spec table. The engine photo is sticky with gentle parallax. No dashboard tiles.

### Pause
A nearly full-bleed photo in a clipped frame, with ±8% parallax inside. Its only text is the caption "Quiet, until it isn't."

### 04 · Gallery
An asymmetric 12-column layout (8/4, 7/5, offset 10). Images wipe up into view, zoom 1.035 on hover for fine pointers only, and open in a full lightbox: arrow keys, Esc, visible Close, focus trap, focus return and scroll lock.

### Closing
"Leave an impression." at up to 15rem. Back-to-top link, section links, disclaimer and photo credits.

## Avoided, on purpose

Feature-card grids · pricing or inventory · fake configurators · neon or glow overload · glassmorphism everywhere · rounded cards · custom cursor · scroll hijacking · buttons that do nothing · unverified specs.
