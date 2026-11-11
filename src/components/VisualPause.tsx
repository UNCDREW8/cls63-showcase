import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import AssetImage from './AssetImage';
import { pause } from '../data/site';

export default function VisualPause() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.pause__inner',
          { yPercent: -8 },
          {
            yPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
        gsap.from('.pause__caption', {
          opacity: 0,
          y: 12,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: root.current, start: 'top 60%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="pause" aria-label="Photograph">
      <figure className="pause__frame">
        <div className="pause__inner">
          <AssetImage slot={pause.slot} />
        </div>
        <figcaption className="pause__caption eyebrow">{pause.caption}</figcaption>
      </figure>
    </section>
  );
}
