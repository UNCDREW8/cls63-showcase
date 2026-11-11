import { images, type SlotId } from '../data/site';
import { resolveImage } from '../lib/assets';

interface Props {
  slot: SlotId;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** Overrides focal point from site.ts */
  position?: string;
}

const order = Object.keys(images) as SlotId[];

/**
 * Renders the photograph for a slot, or a labelled placeholder that
 * tells you exactly which file to supply. Width/height are always set
 * so the layout never shifts when real images arrive.
 */
export default function AssetImage({ slot, className = '', priority, sizes = '100vw', position }: Props) {
  const data = images[slot];
  const resolved = resolveImage(data.file, data.width);

  if (resolved) {
    return (
      <img
        className={`asset ${className}`}
        src={resolved.src}
        srcSet={resolved.srcSet}
        sizes={resolved.srcSet ? sizes : undefined}
        alt={data.alt}
        width={data.width}
        height={data.height}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding={priority ? 'sync' : 'async'}
        style={{ objectPosition: position ?? data.focus }}
      />
    );
  }

  const index = String(order.indexOf(slot) + 1).padStart(2, '0');
  return (
    <div
      className={`asset asset--slot ${className}`}
      role="img"
      aria-label={`Image placeholder: ${data.alt}`}
      style={{ aspectRatio: `${data.width} / ${data.height}` }}
    >
      <span className="slot__floor" aria-hidden="true" />
      <span className="slot__corners" aria-hidden="true" />
      <span className="slot__meta" aria-hidden="true">
        <span>Asset {index} — {data.file}.jpg</span>
        <span className="slot__brief">{data.brief}</span>
        <span>
          {data.width} × {data.height} · src/assets/cls63/
        </span>
      </span>
    </div>
  );
}
