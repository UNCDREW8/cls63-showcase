import { useCallback, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import AssetImage from './AssetImage';
import SectionHead from './SectionHead';
import Lightbox from './Lightbox';
import { gallery, images } from '../data/site';

export default function Gallery() {
  const root = useRef<HTMLElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<number | null>(null);
  const opener = useRef(0);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.utils.toArray<HTMLElement>('.gallery__item').forEach((item) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 88%', once: true } });
          tl.from(item.querySelector('.gallery__clip'), {
            clipPath: 'inset(100% 0% 0% 0%)',
            duration: 1.3,
            ease: 'expo.out',
          }).from(item.querySelector('.gallery__caption'), { opacity: 0, y: 8, duration: 0.6 }, 0.4);
        });
      });
    },
    { scope: root },
  );

  // Focus returns to the thumbnail that opened the lightbox.
  const close = useCallback(() => {
    setOpen(null);
    requestAnimationFrame(() => triggers.current[opener.current]?.focus());
  }, []);

  return (
    <section ref={root} id="gallery" className="gallery section" aria-labelledby="gallery-title" tabIndex={-1}>
      <SectionHead number="04" label="Gallery" />
      <h2 className="gallery__title display-m" id="gallery-title">
        Studies in shadow.
      </h2>

      <ul className="gallery__grid">
        {gallery.map((g, i) => (
          <li className={`gallery__item gallery__item--${g.shape}`} key={g.slot + i}>
            <button
              type="button"
              className="gallery__btn"
              ref={(el) => {
                triggers.current[i] = el;
              }}
              onClick={() => {
                opener.current = i;
                setOpen(i);
              }}
              aria-label={`Open image: ${g.caption}`}
              aria-haspopup="dialog"
            >
              <span className="gallery__clip">
                <AssetImage slot={g.slot} sizes="(min-width: 900px) 50vw, 100vw" />
              </span>
            </button>
            <p className="gallery__caption">
              <span>{String(i + 1).padStart(2, '0')}</span> {g.caption}
            </p>
          </li>
        ))}
      </ul>

      {open !== null && (
        <Lightbox
          items={gallery.map((g) => ({ slot: g.slot, caption: g.caption, alt: images[g.slot].alt }))}
          index={open}
          onIndex={setOpen}
          onClose={close}
        />
      )}
    </section>
  );
}
