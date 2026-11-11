import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { nav } from '../data/site';
import { useAnchorClick } from '../lib/smooth-scroll';

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const onAnchor = useAnchorClick();

  useGSAP(
    () => {
      const setProgress = gsap.quickSetter(bar.current, 'scaleX');

      ScrollTrigger.create({
        start: 0,
        end: 'max',
        refreshPriority: -1,
        onUpdate: (self) => {
          setProgress(self.progress);
          root.current?.classList.toggle('nav--solid', self.scroll() > 40);
        },
      });

      // Highlight the section currently in view.
      nav.forEach(({ href }) => {
        const section = document.querySelector(href);
        const link = root.current?.querySelector(`a[href="${href}"]`);
        if (!section || !link) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 55%',
          end: 'bottom 55%',
          refreshPriority: -1, // measure after pinned sections add their spacing
          onToggle: (self) => {
            link.classList.toggle('is-active', self.isActive);
            if (self.isActive) link.setAttribute('aria-current', 'true');
            else link.removeAttribute('aria-current');
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <header ref={root} className="nav" data-hero-nav>
      <div className="nav__inner">
        <a href="#top" className="nav__mark" onClick={onAnchor} aria-label="CLS 63 — back to top">
          CLS 63
        </a>
        <nav aria-label="Sections">
          <ul className="nav__links">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={onAnchor}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <span className="nav__progress" aria-hidden="true">
        <span ref={bar} />
      </span>
    </header>
  );
}
