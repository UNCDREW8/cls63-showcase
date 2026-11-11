import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import AssetImage from './AssetImage';
import { hero } from '../data/site';
import { useAnchorClick } from '../lib/smooth-scroll';

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const onAnchor = useAnchorClick();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const navEl = document.querySelector('[data-hero-nav] .nav__inner');

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Entrance — short, ~1.6s total. Content is visible without JS.
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.from('.hero__media', { opacity: 0, scale: 1.08, duration: 1.6, ease: 'power2.out' })
          .from('.hero__title-line', { yPercent: 105, duration: 1.1, ease: 'expo.out' }, 0.2)
          .from(
            ['.hero__label', '.hero__tagline', '.hero__cta', '.hero__scroll > *'],
            { opacity: 0, y: 14, duration: 0.8, stagger: 0.08 },
            0.55,
          );
        if (navEl) tl.from(navEl, { opacity: 0, y: -10, duration: 0.8 }, 0.5);

        // Scroll — image and type travel at different rates.
        const st = { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to('.hero__media-inner', { yPercent: 12, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__title', { yPercent: -35, ease: 'none', scrollTrigger: st });
        gsap.to('.hero__copy, .hero__scroll', {
          opacity: 0,
          y: -30,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top top', end: '45% top', scrub: true },
        });
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.from('.hero__media', { opacity: 0, duration: 0.6 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="hero" id="top" aria-labelledby="hero-title" tabIndex={-1}>
      <div className="hero__media">
        <div className="hero__media-inner">
          <AssetImage slot="hero" priority className="hero__img" />
        </div>
        <span className="hero__vignette" aria-hidden="true" />
      </div>

      <h1 className="hero__title" id="hero-title">
        <span className="mask">
          <span className="hero__title-line">{hero.title}</span>
        </span>
      </h1>

      <div className="hero__copy">
        <p className="hero__label eyebrow">{hero.label}</p>
        <p className="hero__tagline">{hero.tagline}</p>
        <a className="hero__cta link-line" href="#overview" onClick={onAnchor}>
          {hero.cta}
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="hero__scroll" aria-hidden="true">
        <span>Scroll</span>
        <span className="hero__scroll-line" />
      </div>
    </section>
  );
}
