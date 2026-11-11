import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { gsap } from 'gsap';
import AssetImage from './AssetImage';
import type { SlotId } from '../data/site';
import { prefersReducedMotion, useSmoothScroll } from '../lib/smooth-scroll';

interface Props {
  items: { slot: SlotId; caption: string; alt: string }[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}

/**
 * Accessible lightbox: modal dialog, focus trapped inside, Escape and
 * arrow keys, visible close button, focus returned to the opener, and
 * page scrolling (Lenis + native) locked while open.
 */
export default function Lightbox({ items, index, onIndex, onClose }: Props) {
  const dialog = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const { lenis } = useSmoothScroll();
  const total = items.length;
  const item = items[index];

  const prev = () => onIndex((index - 1 + total) % total);
  const next = () => onIndex((index + 1) % total);

  // Lock scroll + initial focus.
  useEffect(() => {
    lenis?.stop();
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = 'hidden';
    closeBtn.current?.focus();

    const siblings = Array.from(document.body.children).filter(
      (el) => el !== dialog.current?.parentElement && !el.hasAttribute('inert'),
    );
    siblings.forEach((el) => el.setAttribute('inert', ''));

    if (!prefersReducedMotion() && dialog.current) {
      gsap.from(dialog.current, { opacity: 0, duration: 0.35, ease: 'power2.out' });
    }

    return () => {
      siblings.forEach((el) => el.removeAttribute('inert'));
      html.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [lenis]);

  // Subtle crossfade on image change.
  useEffect(() => {
    if (prefersReducedMotion() || !stage.current) return;
    const t = gsap.fromTo(stage.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out' });
    return () => {
      t.kill();
    };
  }, [index]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      next();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prev();
    } else if (e.key === 'Tab') {
      const focusables = dialog.current?.querySelectorAll<HTMLElement>('button');
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  return createPortal(
    <div className="lightbox-root">
      <div
        ref={dialog}
        className="lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={`Gallery image ${index + 1} of ${total}: ${item.caption}`}
        onKeyDown={onKeyDown}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        data-lenis-prevent
      >
        <div className="lightbox__bar">
          <span className="eyebrow" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} — {item.caption}
          </span>
          <button ref={closeBtn} type="button" className="lightbox__btn" onClick={onClose}>
            Close <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div ref={stage} className="lightbox__stage">
          <AssetImage slot={item.slot} priority className="lightbox__img" />
        </div>

        <div className="lightbox__nav">
          <button type="button" className="lightbox__btn" onClick={prev} aria-label="Previous image">
            <span aria-hidden="true">←</span> Prev
          </button>
          <button type="button" className="lightbox__btn" onClick={next} aria-label="Next image">
            Next <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
