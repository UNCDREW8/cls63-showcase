---
tags: [cls63, handoff]
updated: 2026-11-11
---

# Project log & handoff

> A summary of how this project was built and where it stands, so any assistant (another model, another account) or person can pick it up cold.
> Read this first, then [[CLAUDE]] for the working rules.

## The brief, in short

Build a working single-page showcase for the Mercedes-AMG CLS 63. It should feel like an exclusive digital exhibition, not a dealership. The look is dark, minimal, cinematic and editorial, with the car always the focus. The tagline is **"Quiet luxury. Brutal presence."**

Stack required: React + TypeScript, **Lenis** for smooth scroll, **GSAP + ScrollTrigger** for scroll choreography, and **one or two React Bits** effects at most. It must be accessible, respect reduced motion, and use no unverified specs.

## Owner's preferences (keep these)

- **Photos:** every photo shows the **same car and the same model year**, a **black car on a black background**. Never use an unrelated car.
- **Signature moment:** a **scroll-driven light trace** from headlight to taillight, drawn precisely over the side-profile photo. It's the main design sequence.
- **Public repo, viewing only:** something to share with friends and family. **No prompts and no private information** anywhere in the repo.
- **License:** MIT for the code. Third-party content keeps its own license.
- Docs should be readable and interesting.

## Timeline

1. **Built the site.** Eight sections: hero, overview, design sequence, performance, pause, gallery, closing. It used one Lenis instance driven by the GSAP ticker, and React Bits `ScrollReveal` on the intro paragraph only.
2. **Specs v1:** a 2018 CLS 63 S, later **replaced** to match the photographed car (see step 5).
3. **Photos, first attempt:** none could be fetched at first, so the site used labelled placeholders for a while.
4. **Light trace built:** this replaced the three-image crossfade. The SVG path is traced in the side photo's own pixel coordinates.
5. **Photo set chosen:** Michael Sheehan's set of **one 2013 CLS63 AMG** on Wikimedia Commons (CC BY 2.0). The red calipers mean the **AMG Performance Package** was fitted, so the specs moved to that exact version.
6. **Published:** the GitHub repo was created, with the Claude GitHub App installed on **this repo only**. GitHub Pages is live.
7. **Photos processed on GitHub Actions** (`photos.yml`): downloaded, background removed (rembg), paint graded to black on black, and committed. The **licence plate** in the rear photo was **blanked out**.
8. **Light trace aligned** to the processed photo, and the glow positions were tuned.
9. **Docs:** README rewritten, plus [[DESIGN]], [[NOTES]], [[CLAUDE]] and an MIT `LICENSE`.
10. **Obsidian:** this log and [[Home]] were added so the repo works as an Obsidian vault. The notes were also added to the owner's Obsidian vault in a `CLS 63` folder.

## Where things are

| What | Where |
|---|---|
| Live site | https://uncdrew8.github.io/cls63-showcase/ |
| Repo | https://github.com/UNCDREW8/cls63-showcase |
| All content & specs | `src/data/site.ts` |
| Light trace | `src/components/LightTrace.tsx` + `design.trace` in `site.ts` |
| Photo pipeline | `scripts/process_photos.py`, `.github/workflows/photos.yml` |
| Deploy | `.github/workflows/deploy.yml` (on every push to `main`) |

## Current specs (verified)

2013 CLS63 AMG with AMG Performance Package, US spec: **550 hp · 590 lb-ft · 0–60 mph 4.3 s · 186 mph limited**, 5.5 L V8 biturbo, 7-speed MCT, RWD. Sources are in [[NOTES]].

## Open items

- [ ] **Clean the git history.** An old commit still has the un-redacted rear photo (licence plate), and an early web edit shows the committer's email. This needs a history rewrite, waiting on the owner's go-ahead.
- [ ] Optional: GitHub → Settings → Emails → *Keep my email addresses private*.
- [ ] Optional: higher-resolution photos of the same car, because the side profile is 1200px wide.
- [ ] Optional: a second trace along the roofline.

## Tips for the next session

- Image downloads and processing run best on **GitHub Actions** (see `photos.yml`), with the results committed to the repo.
- Repo settings such as Pages are changed in the GitHub web UI.
- The light trace is tied to `profile.jpg` at exactly 1200 × 742. Re-trace it if that photo changes.
- The Obsidian notes are a copy. The repo is the source of truth, so re-copy them after big changes.
