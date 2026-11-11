import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollReveal from './reactbits/ScrollReveal';
import SectionHead from './SectionHead';
import { intro } from '../data/site';

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  // GSAP owns the heading; React Bits owns the paragraph. Never both on one element.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.intro__line', {
          yPercent: 110,
          duration: 1.2,
          ease: 'expo.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.intro__heading', start: 'top 82%', once: true },
        });
        gsap.from('.section-head__rule', {
          scaleX: 0,
          transformOrigin: '0 50%',
          duration: 1.4,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: root.current, start: 'top 80%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="overview" className="intro section" aria-labelledby="intro-title" tabIndex={-1}>
      <SectionHead number={intro.number} label={intro.label} />
      <div className="intro__grid">
        <h2 className="intro__heading display-l" id="intro-title">
          {intro.heading.map((line) => (
            <span className="mask" key={line}>
              <span className="intro__line">{line}</span>
            </span>
          ))}
        </h2>
        <ScrollReveal
          as="p"
          containerClassName="intro__body"
          baseOpacity={0.14}
          blurStrength={3}
          baseRotation={0}
          stagger={0.035}
          wordAnimationEnd="top 35%"
        >
          {intro.body}
        </ScrollReveal>
      </div>
    </section>
  );
}
