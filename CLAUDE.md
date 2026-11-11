# CLAUDE.md

Guidance for AI coding assistants working in this repository.

## What this is

A single-page scroll showcase for the Mercedes-AMG CLS 63, built with React, TypeScript and Vite. It's a dark, editorial look, and the car is always the subject. Read `docs/Project log.md` first (history, owner preferences, open items), and `DESIGN.md` before changing anything visual.

## Commands

```bash
npm install
npm run dev            # dev server
npm run build          # type-check + production build → dist/
npm run build:single   # one self-contained HTML file → dist-single/
npm run lint           # oxlint
```

The deploy to GitHub Pages runs automatically on every push to `main` (`.github/workflows/deploy.yml`). Vite's `base` comes from `BASE_PATH`.

## Map

```
src/data/site.ts            ALL content: copy, specs, image slots, alt text, credits, trace path
src/lib/smooth-scroll.tsx   the single Lenis instance + GSAP ticker + anchor scrolling
src/lib/assets.ts           build-time image slot resolution (+ automatic -1200w srcset)
src/components/             one component per section
src/components/reactbits/   vendored React Bits ScrollReveal (locally edited)
scripts/process_photos.py   background removal + black grade + plate redaction
.github/workflows/          deploy.yml (Pages), photos.yml (one-off photo prep)
```

## Rules

**Content**
- Content belongs in `src/data/site.ts`. Don't hard-code copy in components.
- Specs must match the photographed car: **2013 CLS63 AMG + AMG Performance Package, US spec**. Don't mix in other years, S-models or 4MATIC figures, and don't add a number without a source. Record new sources in `NOTES.md`.
- Every photo must be the same car and year, black on a black background. Never add an unrelated car to fill a slot. An empty slot shows a labelled placeholder.
- Keep the photo credits (CC BY 2.0) in `credits` and in the footer.
- Never publish anything that identifies a private person, such as licence plates or faces. `REDACT` in `process_photos.py` handles the rear plate.

**Animation**
- Use **one** Lenis instance, driven by `gsap.ticker`. Never enable `autoRaf`, and never add ScrollSmoother or another smooth-scroll library.
- Use `useGSAP` with a `scope`. Put every effect inside `gsap.matchMedia()` with a reduced-motion branch.
- No element is animated by two libraries. React Bits is used only on the intro paragraph.
- Use `gsap.from()` so content is visible without JS. Animate transform, opacity and `clip-path` only.
- Triggers created before a pinned section need `refreshPriority: -1` (see `Nav.tsx`).

**The light trace** (`LightTrace.tsx`)
- The photo and SVG share one box with the photo's aspect ratio. The `viewBox` uses the photo's pixel units.
- Never crop, reposition or `object-fit: cover` the profile image. It must stay uncropped at 1200 × 742.
- If `profile.jpg` changes, re-trace `design.trace.path`, `head` and `tail` against the new photo.

**Style**
- Square corners, thin rules, generous space. Red is for tiny marks and the end of the trace only.
- Don't add custom cursors, glassmorphism, card grids, neon or bouncing text.
- Accessibility isn't optional: semantic HTML, real alt text, visible focus, keyboard support everywhere.

## Before you finish

1. `npm run build` passes (it type-checks).
2. Check the page at desktop (1440px) and mobile (390px), with reduced motion on and off.
3. Look at the light trace: does the line still sit on the car's shoulder?
4. Update `README.md`, `DESIGN.md` or `NOTES.md` if behaviour, design or sources changed.
5. Add a line to `docs/Project log.md` (timeline + open items). Never put prompts or personal info in it: the repo is public.
