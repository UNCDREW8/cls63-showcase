import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface ScrollApi {
  lenis: Lenis | null;
  scrollTo: (target: string | HTMLElement | number) => void;
}

const Ctx = createContext<ScrollApi>({ lenis: null, scrollTo: () => {} });

/**
 * One Lenis instance for the whole page, driven by GSAP's ticker so
 * Lenis and ScrollTrigger share a single animation loop.
 * Skipped entirely when the visitor prefers reduced motion.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const instance = new Lenis({ autoRaf: false, lerp: 0.09, wheelMultiplier: 0.9 });
    instance.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Re-measure triggers once fonts and images have settled.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') refresh();
    else window.addEventListener('load', refresh, { once: true });
    document.fonts?.ready.then(refresh);
    return () => window.removeEventListener('load', refresh);
  }, []);

  const scrollTo: ScrollApi['scrollTo'] = (target) => {
    const el =
      typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target;
    if (el === null) return;

    const focus = () => {
      if (el instanceof HTMLElement) el.focus({ preventScroll: true });
    };

    if (lenis) {
      lenis.scrollTo(el as HTMLElement | number, {
        duration: 1.6,
        easing: (t) => 1 - Math.pow(1 - t, 4),
        onComplete: focus,
      });
    } else if (typeof el === 'number') {
      window.scrollTo({ top: el });
    } else {
      el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      focus();
    }
  };

  return <Ctx.Provider value={{ lenis, scrollTo }}>{children}</Ctx.Provider>;
}

export const useSmoothScroll = () => useContext(Ctx);

/** Click handler for in-page anchors that routes through Lenis. */
export function useAnchorClick() {
  const { scrollTo } = useSmoothScroll();
  return (e: React.MouseEvent<HTMLAnchorElement>) => {
    const href = e.currentTarget.getAttribute('href');
    if (!href?.startsWith('#')) return;
    e.preventDefault();
    if (href === '#top') scrollTo(0);
    else scrollTo(href);
    history.replaceState(null, '', href === '#top' ? location.pathname : href);
  };
}
