import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { closing, credits, nav } from '../data/site';
import { useAnchorClick } from '../lib/smooth-scroll';

export default function Closing() {
  const root = useRef<HTMLElement>(null);
  const onAnchor = useAnchorClick();
  const words = closing.heading.split(' ');

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.from('.closing__word', {
          yPercent: 110,
          duration: 1.3,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.closing__heading', start: 'top 85%', once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="closing">
      <div className="section">
        <h2 className="closing__heading">
          {words.map((w) => (
            <span className="mask" key={w}>
              <span className="closing__word">{w}</span>
            </span>
          ))}
        </h2>

        <div className="closing__bar">
          <a href="#top" className="link-line" onClick={onAnchor}>
            Back to top <span aria-hidden="true">↑</span>
          </a>
          <nav aria-label="Footer">
            <ul className="closing__links">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={onAnchor}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="closing__note">{closing.disclaimer}</p>
        <p className="closing__note closing__credits">
          Photographs: one 2013 CLS63 AMG via Wikimedia Commons; backgrounds removed, recoloured to black and cropped for this site:{' '}
          {credits.map((c, i) => (
            <span key={c.slot}>
              <a href={c.source} target="_blank" rel="noopener noreferrer">
                {c.slot}
              </a>{' '}
              © {c.author}, {c.license}
              {i < credits.length - 1 ? ' · ' : '.'}
            </span>
          ))}
        </p>
      </div>
    </footer>
  );
}
