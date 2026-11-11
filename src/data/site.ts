/**
 * ─────────────────────────────────────────────────────────────
 *  CLS 63 — editable site content
 *  Everything a non-developer should need to change lives here:
 *  image slots, captions, alt text, copy and vehicle specs.
 * ─────────────────────────────────────────────────────────────
 */

/* ── IMAGE SLOTS ──────────────────────────────────────────────
 * Drop photographs into  src/assets/cls63/  using the file names
 * below. Any slot without a file renders a labelled placeholder,
 * so the layout never shows a broken image or an unrelated car.
 *
 * Optional responsive variants: add  hero-1200w.jpg, hero-800w.jpg
 * next to  hero.jpg  and they are picked up automatically as srcset.
 *
 * Keep every photo the same generation: C218 facelift (2015–2018),
 * ideally black or dark graphite, against dark studio/architecture.
 */
export type SlotId =
  | 'hero'
  | 'profile'
  | 'headlight'
  | 'rear'
  | 'engine'
  | 'pause'
  | 'wheel'
  | 'interior';

export interface ImageSlot {
  file: string; // base file name, without extension
  alt: string;
  brief: string; // shown on the placeholder: what to shoot
  width: number; // intrinsic size, reserves layout space
  height: number;
  focus?: string; // CSS object-position
}

export const images: Record<SlotId, ImageSlot> = {
  hero: {
    file: 'hero',
    alt: 'Black 2013 CLS63 AMG seen from above the bonnet, three-pointed star and grille on a black background',
    brief: 'Front overhead · 2013 CLS63 AMG',
    width: 2400,
    height: 1350,
    focus: '50% 45%',
  },
  profile: {
    // Must stay 1200 × 742 and uncropped: the light trace is drawn on it.
    file: 'profile',
    alt: 'Side profile of a black 2013 CLS63 AMG on a black background, showing its unbroken coupé roofline over four doors',
    brief: 'Full side profile · 2013 CLS63 AMG · uncropped 1200×742',
    width: 1200,
    height: 742,
  },
  headlight: {
    file: 'headlight',
    alt: 'LED headlamp of a 2013 CLS63 AMG in close-up',
    brief: 'Headlamp detail · 2013 CLS63 AMG',
    width: 2400,
    height: 1350,
  },
  rear: {
    file: 'rear',
    alt: 'Rear of a black 2013 CLS63 AMG with quad tailpipes, on a black background',
    brief: 'Rear · 2013 CLS63 AMG',
    width: 2400,
    height: 1350,
  },
  engine: {
    file: 'engine',
    alt: 'The handcrafted AMG 5.5-litre biturbo V8 of a 2013 CLS63 AMG',
    brief: 'Engine close-up, portrait · 2013 CLS63 AMG',
    width: 1200,
    height: 1500,
  },
  pause: {
    file: 'pause',
    alt: 'Engine bay of a 2013 CLS63 AMG with the AMG V8 under a single pool of light',
    brief: 'Engine bay, wide · 2013 CLS63 AMG',
    width: 2400,
    height: 1200,
  },
  wheel: {
    file: 'wheel',
    alt: 'AMG wheel and red brake caliper of a 2013 CLS63 AMG',
    brief: 'Wheel and caliper, portrait · 2013 CLS63 AMG',
    width: 1200,
    height: 1500,
  },
  interior: {
    file: 'interior',
    alt: 'AMG steering wheel and instruments of a 2013 CLS63 AMG',
    brief: 'Steering wheel · 2013 CLS63 AMG',
    width: 1600,
    height: 1200,
  },
};

/* ── NAVIGATION ───────────────────────────────────────────── */
export const nav = [
  { label: 'Overview', href: '#overview' },
  { label: 'Design', href: '#design' },
  { label: 'Performance', href: '#performance' },
  { label: 'Gallery', href: '#gallery' },
] as const;

/* ── HERO ─────────────────────────────────────────────────── */
export const hero = {
  label: 'Mercedes-Benz / AMG',
  title: 'CLS 63',
  tagline: 'Quiet luxury. Brutal presence.',
  cta: 'Explore the machine',
};

/* ── INTRODUCTION ─────────────────────────────────────────── */
export const intro = {
  number: '01',
  label: 'Overview',
  // Each array entry is one revealed line of the heading.
  heading: ['Presence,', 'without permission.'],
  body:
    'A coupé roofline stretched over four doors, and under the bonnet a hand-assembled AMG V8. The CLS 63 S looks calm. It is not. That gap between composure and force is the whole point of the car.',
};

/* ── PINNED DESIGN SEQUENCE ───────────────────────────────── */
export const design = {
  number: '02',
  label: 'Design',
  // Stages appear in step with the light as it travels front → rear.
  frames: [
    {
      heading: 'The stare.',
      copy: 'Narrow LED headlamps set low and wide. It looks at you before you look at it.',
    },
    {
      heading: 'The silhouette.',
      copy: 'One unbroken shoulder from nose to tail — a coupé’s line, drawn over a four-door car.',
    },
    {
      heading: 'The final impression.',
      copy: 'The line settles into the taillamp. Nothing more to say.',
    },
  ],
  /* Light trace — coordinates are in the side-profile photo's own pixels
   * (viewBox). If you replace profile.jpg with a different photograph,
   * re-trace `path`, `head` and `tail` for that photo. */
  trace: {
    slot: 'profile' as SlotId,
    viewBox: [1200, 742] as const,
    path: 'M 132 424 C 200 410, 300 404, 400 412 C 520 420, 700 424, 860 424 C 960 423, 1040 412, 1106 406',
    head: { x: 104, y: 428, r: 34 },
    tail: { x: 1132, y: 420, r: 30 },
    redFrom: 980, // x where the line begins warming to taillight red
    final: 'Every line has intent.',
  },
};

/* ── PERFORMANCE ──────────────────────────────────────────────
 * ONE variant only, matching the car in every photograph:
 * 2013 Mercedes-Benz CLS63 AMG (C218) with the AMG Performance Package
 * (the package fitted the red calipers seen in the photos), US spec.
 *
 * Source: Mercedes-Benz USA, "Equipment List – 2012 CLS63 AMG" (figures
 * in brackets = AMG Performance Package): 550 hp / 590 lb-ft, 0–60 mph
 * 4.3 s, 186 mph electronically limited. The 2013 model year carried
 * these over unchanged (MBUSA 2013 release: 518 hp / 516 lb-ft standard,
 * 550 hp / 590 lb-ft with the package).
 */
export interface Spec {
  value: number;
  decimals?: number;
  unit: string;
  label: string;
  note?: string;
}

export const performance = {
  number: '03',
  label: 'Performance',
  heading: 'Composure meets force.',
  variant: '2013 Mercedes-Benz CLS63 AMG · AMG Performance Package · US specification',
  image: 'engine' as SlotId,
  primary: [
    { value: 550, unit: 'hp', label: 'Output' },
    { value: 590, unit: 'lb-ft', label: 'Torque' },
    { value: 4.3, decimals: 1, unit: 's', label: '0–60 mph' },
  ] as Spec[],
  secondary: [
    { label: 'Engine', value: '5.5 L V8 biturbo · 5,461 cc' },
    { label: 'Transmission', value: 'AMG SPEEDSHIFT MCT 7-speed' },
    { label: 'Drive', value: 'Rear-wheel drive' },
    { label: 'Top speed', value: '186 mph · electronically limited' },
  ] as { label: string; value: string; placeholder?: boolean }[],
};

/* ── VISUAL PAUSE ─────────────────────────────────────────── */
export const pause = {
  slot: 'pause' as SlotId,
  caption: 'Quiet, until it isn’t.',
};

/* ── GALLERY ──────────────────────────────────────────────── */
export const gallery: { slot: SlotId; caption: string; shape: 'wide' | 'tall' | 'square' }[] = [
  { slot: 'headlight', caption: 'Headlamp', shape: 'wide' },
  { slot: 'wheel', caption: 'Wheel detail', shape: 'tall' },
  { slot: 'rear', caption: 'Rear', shape: 'wide' },
  { slot: 'interior', caption: 'Interior', shape: 'square' },
  { slot: 'profile', caption: 'Side profile', shape: 'wide' },
];

/* ── PHOTO CREDITS ──────────────────────────────────────────
 * Every photo is the SAME car: one 2013 CLS63 AMG, photographed by
 * Michael Sheehan (Wikimedia Commons, CC BY 2.0 — attribution required).
 * Edited for this site: background removed and replaced with black,
 * paint and image graded to black/monochrome, cropped to each slot.
 */
export const credits = [
  { slot: 'hero', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Front_Overhead_-_2013_Mercedes_CLS_63_AMG_(9267459941).jpg' },
  { slot: 'profile', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Side_View_-_2013_Mercedes_CLS_63_AMG_(9270241280).jpg' },
  { slot: 'headlight', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Headlight_-_2013_Mercedes_CLS_63_AMG_(9267460829).jpg' },
  { slot: 'rear', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Rear_-_2013_Mercedes_CLS_63_AMG_(9270242342).jpg' },
  { slot: 'engine', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Engine_Close-up_-_2013_Mercedes_CLS_63_AMG_(9270242990).jpg' },
  { slot: 'pause', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Engine_-_2013_Mercedes_CLS_63_AMG_(9267461479).jpg' },
  { slot: 'wheel', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Front_Wheel_-_2013_Mercedes_CLS_63_AMG_(9267460745).jpg' },
  { slot: 'interior', author: 'Michael Sheehan', license: 'CC BY 2.0', source: 'https://commons.wikimedia.org/wiki/File:Steering_Wheel_-_2013_Mercedes_CLS_63_AMG_(9267460443).jpg' },
];

/* ── CLOSING ──────────────────────────────────────────────── */
export const closing = {
  heading: 'Leave an impression.',
  disclaimer:
    'An independent concept showcase. Not an official Mercedes-Benz or Mercedes-AMG website, and not affiliated with or endorsed by Mercedes-Benz Group AG. Mercedes-Benz, AMG and CLS are trademarks of their respective owner.',
};
