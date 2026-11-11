import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import AssetImage from './AssetImage';
import SectionHead from './SectionHead';
import { design } from '../data/site';

/**
 * Signature sequence — a light traced from headlight to taillight.
 *
 * The photograph and the SVG share ONE box with the photo's exact aspect
 * ratio and a viewBox in the photo's own pixel units, so the path stays
 * locked to the bodywork at every screen size. The image is never cropped
 * or moved independently of the overlay.
 *
 * Without JS / with reduced motion the line is simply shown complete.
 */
export default function LightTrace() {
  const root = useRef<HTMLElement>(null);
  const t = design.trace;
  const [vw, vh] = t.viewBox;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const el = root.current!;
      const path = el.querySelector<SVGPathElement>('.trace__line')!;
      const glow = el.querySelector<SVGPathElement>('.trace__glow')!;
      const tip = el.querySelector<SVGCircleElement>('.trace__tip')!;
      const len = path.getTotalLength();

      mm.add(
        {
          desktop: '(min-width: 900px) and (prefers-reduced-motion: no-preference)',
          mobile: '(max-width: 899px) and (prefers-reduced-motion: no-preference)',
        },
        (ctx) => {
          const { desktop } = ctx.conditions as { desktop: boolean };
          el.classList.add('is-animated');

          gsap.set([path, glow], { strokeDasharray: len, strokeDashoffset: len });
          gsap.set('.trace__head', { opacity: 0, scale: 0.6, transformOrigin: '50% 50%' });
          gsap.set('.trace__tail', { opacity: 0 });
          gsap.set('.trace__photo', { opacity: 0.55 });
          gsap.set('.trace__stage', { autoAlpha: 0, y: 24 });
          gsap.set('.trace__final', { autoAlpha: 0, y: 20 });
          gsap.set(tip, { opacity: 0 });

          const setTip = (p: number) => {
            const pt = path.getPointAtLength(len * p);
            tip.setAttribute('cx', String(pt.x));
            tip.setAttribute('cy', String(pt.y));
          };
          const drawState = { p: 0 };

          const tl = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: '.trace__pin',
              start: 'top top',
              end: () => `+=${window.innerHeight * (desktop ? 3 : 1.7)}`,
              pin: true,
              scrub: 0.6,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // 1 · headlight wakes, photo lifts
          tl.to('.trace__head', { opacity: 1, scale: 1, duration: 0.18, ease: 'power2.out' }, 0)
            .to('.trace__photo', { opacity: 0.85, duration: 0.3 }, 0)
            .to(tip, { opacity: 1, duration: 0.05 }, 0.1);

          // 2 · the line draws front → rear, a bright tip riding its end
          tl.to([path, glow], { strokeDashoffset: 0, duration: 1 }, 0.12).to(
            drawState,
            { p: 1, duration: 1, onUpdate: () => setTip(drawState.p) },
            0.12,
          );

          // stage captions in step with the line
          const stages = gsap.utils.toArray<HTMLElement>('.trace__stage');
          const span = 1 / stages.length;
          stages.forEach((s, i) => {
            const at = 0.12 + i * span;
            tl.to(s, { autoAlpha: 1, y: 0, duration: 0.08, ease: 'power2.out' }, at);
            if (i < stages.length - 1) tl.to(s, { autoAlpha: 0, y: -16, duration: 0.06 }, at + span - 0.06);
          });

          // 3 · taillight answers in red, headline arrives
          tl.to(tip, { opacity: 0, duration: 0.05 }, 1.1)
            .to('.trace__head', { opacity: 0.35, duration: 0.2 }, 1.1)
            .to('.trace__tail', { opacity: 1, duration: 0.16, ease: 'power2.out' }, 1.1)
            .to(stages[stages.length - 1], { autoAlpha: 0, y: -16, duration: 0.06 }, 1.14)
            .to('.trace__photo', { opacity: 1, duration: 0.2 }, 1.12)
            .to('.trace__final', { autoAlpha: 1, y: 0, duration: 0.14, ease: 'power2.out' }, 1.18)
            // 4 · brief hold before release
            .to({}, { duration: 0.3 });

          return () => el.classList.remove('is-animated');
        },
      );
    },
    { scope: root },
  );

  return (
    <section ref={root} id="design" className="trace" aria-labelledby="design-title" tabIndex={-1}>
      <div className="section trace__head-wrap">
        <SectionHead number={design.number} label={design.label} />
      </div>

      <div className="trace__pin">
        <figure className="trace__figure" style={{ aspectRatio: `${vw} / ${vh}` }}>
          <div className="trace__photo">
            <AssetImage slot={t.slot} sizes="(min-width: 900px) 90vw, 100vw" />
          </div>

          <svg className="trace__svg" viewBox={`0 0 ${vw} ${vh}`} aria-hidden="true" focusable="false">
            <defs>
              <linearGradient id="trace-grad" gradientUnits="userSpaceOnUse" x1={t.redFrom} y1="0" x2={t.tail.x} y2="0">
                <stop offset="0" stopColor="#e9e9e4" />
                <stop offset="1" stopColor="#c0242b" />
              </linearGradient>
              <radialGradient id="trace-head-g">
                <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="0.35" stopColor="#dfe6ee" stopOpacity="0.35" />
                <stop offset="1" stopColor="#dfe6ee" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="trace-tail-g">
                <stop offset="0" stopColor="#ff3b3b" stopOpacity="0.9" />
                <stop offset="0.4" stopColor="#c0242b" stopOpacity="0.35" />
                <stop offset="1" stopColor="#c0242b" stopOpacity="0" />
              </radialGradient>
              <filter id="trace-blur" x="-10%" y="-200%" width="120%" height="500%">
                <feGaussianBlur stdDeviation="3.5" />
              </filter>
            </defs>

            <ellipse className="trace__head" cx={t.head.x} cy={t.head.y} rx={t.head.r * 1.6} ry={t.head.r} fill="url(#trace-head-g)" />
            <ellipse className="trace__tail" cx={t.tail.x} cy={t.tail.y} rx={t.tail.r * 1.4} ry={t.tail.r} fill="url(#trace-tail-g)" />

            <path className="trace__glow" d={t.path} stroke="url(#trace-grad)" filter="url(#trace-blur)" />
            <path className="trace__line" d={t.path} stroke="url(#trace-grad)" />
            <circle className="trace__tip" r="2.6" cx={t.head.x} cy={t.head.y} />
          </svg>
        </figure>

        <div className="trace__captions">
          <h2 className="sr-only" id="design-title">
            Design
          </h2>
          <ol className="trace__stages">
            {design.frames.map((f, i) => (
              <li className="trace__stage" key={f.heading}>
                <span className="trace__index">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="trace__title">{f.heading}</h3>
                <p className="trace__copy">{f.copy}</p>
              </li>
            ))}
          </ol>
          <p className="trace__final">{t.final}</p>
        </div>
      </div>
    </section>
  );
}
