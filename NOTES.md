# Project notes

Decisions, sources and loose ends, kept in one place.

## Decisions

| Decision | Why |
|---|---|
| **One car, one model year** (2013 CLS63 AMG) | Mixing generations, years or colours breaks the illusion. One photographer's set of one car keeps every shot consistent. |
| **Black on black, done in post** | No freely licensed photos exist of a black CLS 63 on black. Removing the backgrounds and grading the paint gets the look honestly from real photos. |
| **Specs match the photographed car** | The red brake calipers mean the AMG Performance Package was fitted, so the figures are for that exact version. |
| **The light trace is the centrepiece** | It replaced a three-image crossfade. One unforgettable moment beats several fine ones. |
| **Lenis driven by the GSAP ticker** | One animation loop keeps smooth scrolling and ScrollTrigger in step. A second scroll library would cause jitter. |
| **React Bits used once** | `ScrollReveal` on the intro paragraph only. Every heading animation is GSAP's, so no element has two libraries moving it. |
| **No WebGL or 3D** | No suitable 3D model exists, and faking 3D from a flat photo looks cheap. |
| **Fonts bundled locally** | No third-party font requests, and no layout shift when fonts load. |

## Specification sources

Variant: **2013 Mercedes-Benz CLS63 AMG with AMG Performance Package, US specification**.

| Figure | Value | Source |
|---|---|---|
| Output | 550 hp | Mercedes-Benz USA, *The new Mercedes-Benz CLS63 AMG* (with AMG Performance package) |
| Torque | 590 lb-ft | Same |
| Displacement | 5,461 cc | Same |
| 0–60 mph | 4.3 s | Mercedes-Benz USA, *Equipment List – 2012 CLS63 AMG* (Performance Package figure) |
| Top speed | 186 mph, electronically limited | Same |
| Transmission | AMG SPEEDSHIFT MCT 7-speed | Same |

The 2013 model year carried the 2012 powertrain over unchanged.

## Photo credits

All photos are by **Michael Sheehan**, via Wikimedia Commons, under **CC BY 2.0**.
Edits for this site: background removed and replaced with black, paint graded to black or monochrome, cropped, and the licence plate blanked out.

| Slot | Original |
|---|---|
| hero | [Front Overhead – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Front_Overhead_-_2013_Mercedes_CLS_63_AMG_(9267459941).jpg) |
| profile | [Side View – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Side_View_-_2013_Mercedes_CLS_63_AMG_(9270241280).jpg) |
| headlight | [Headlight – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Headlight_-_2013_Mercedes_CLS_63_AMG_(9267460829).jpg) |
| rear | [Rear – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Rear_-_2013_Mercedes_CLS_63_AMG_(9270242342).jpg) |
| engine | [Engine Close-up – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Engine_Close-up_-_2013_Mercedes_CLS_63_AMG_(9270242990).jpg) |
| pause | [Engine – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Engine_-_2013_Mercedes_CLS_63_AMG_(9267461479).jpg) |
| wheel | [Front Wheel – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Front_Wheel_-_2013_Mercedes_CLS_63_AMG_(9267460745).jpg) |
| interior | [Steering Wheel – 2013 Mercedes CLS 63 AMG](https://commons.wikimedia.org/wiki/File:Steering_Wheel_-_2013_Mercedes_CLS_63_AMG_(9267460443).jpg) |

The site's footer shows the same credits.

## Licensing at a glance

| Part | License |
|---|---|
| Source code | MIT (see `LICENSE`) |
| Photographs in `src/assets/cls63/` | CC BY 2.0. Credit Michael Sheehan if you reuse them |
| `src/components/reactbits/ScrollReveal.tsx` | MIT + Commons Clause (React Bits) |
| Fonts | SIL Open Font License (Archivo, IBM Plex Mono via Fontsource) |

## Known limits & ideas

- The source photos are 1200px wide, so on very large screens the side profile softens slightly. Higher-resolution photos of the same car would fix this.
- The side photo is the pre-facelift car (2011–2014 C218). If you switch to a facelift car, change the photos and the specs together.
- A possible extension is a second trace along the roofline, drawn on the way back up.
