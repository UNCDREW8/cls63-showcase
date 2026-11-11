import { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import AssetImage from './AssetImage';
import SectionHead from './SectionHead';
import { performance as perf } from '../data/site';

const fmt = (v: number, d = 0) =>
  v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export default function Performance() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Count up once. Final values are in the HTML and in the
        // screen-reader text, so nothing depends on this running.
        gsap.utils.toArray<HTMLElement>('[data-count]').forEach((el) => {
          const target = Number(el.dataset.count);
          const decimals = Number(el.dataset.decimals ?? 0);
          const state = { v: 0 };
          gsap.to(state, {
            v: target,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => (el.textContent = fmt(state.v, decimals)),
            scrollTrigger: {
              trigger: el,
              start: 'top 85%',
              once: true,
              onEnter: () => (el.textContent = fmt(0, decimals)),
            },
          });
        });

        gsap.from('.perf__heading .perf__line', {
          yPercent: 110,
          duration: 1.2,
          stagger: 0.1,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.perf__heading', start: 'top 80%', once: true },
        });

        gsap.from('.perf__row', {
          opacity: 0,
          y: 16,
          duration: 0.8,
          stagger: 0.07,
          ease: 'power2.out',
          scrollTrigger: { trigger: '.perf__table', start: 'top 85%', once: true },
        });

        gsap.fromTo(
          '.perf__media .asset',
          { yPercent: -6, scale: 1.12 },
          {
            yPercent: 6,
            scale: 1.12,
            ease: 'none',
            scrollTrigger: { trigger: '.perf__media', start: 'top bottom', end: 'bottom top', scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  const [first, ...rest] = perf.heading.split(' ');

  return (
    <section ref={root} id="performance" className="perf section" aria-labelledby="perf-title" tabIndex={-1}>
      <SectionHead number={perf.number} label={perf.label} />

      <div className="perf__grid">
        <div className="perf__text">
          <h2 className="perf__heading display-l" id="perf-title">
            <span className="mask">
              <span className="perf__line">{first}</span>
            </span>
            <span className="mask">
              <span className="perf__line">{rest.join(' ')}</span>
            </span>
          </h2>
          <p className="perf__variant">{perf.variant}</p>

          <dl className="perf__figures">
            {perf.primary.map((s) => (
              <div className="perf__figure" key={s.label}>
                <dt className="eyebrow">{s.label}</dt>
                <dd>
                  <span className="sr-only">
                    {fmt(s.value, s.decimals)} {s.unit}
                    {s.note ? ` ${s.note}` : ''}
                  </span>
                  <span className="perf__num" aria-hidden="true">
                    <span data-count={s.value} data-decimals={s.decimals ?? 0}>
                      {fmt(s.value, s.decimals)}
                    </span>
                    <span className="perf__unit">{s.unit}</span>
                  </span>
                  {s.note && (
                    <span className="perf__note" aria-hidden="true">
                      {s.note}
                    </span>
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <dl className="perf__table">
            {perf.secondary.map((row) => (
              <div className={`perf__row${'placeholder' in row ? ' is-placeholder' : ''}`} key={row.label}>
                <dt className="eyebrow">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="perf__media">
          <AssetImage slot={perf.image} sizes="(min-width: 900px) 40vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
