/**
 * Resolves image slots to real files at build time.
 * Any file in src/assets/cls63 named  <slot>.<ext>  or  <slot>-<width>w.<ext>
 * is picked up. Missing slots return null and render a placeholder.
 */
const modules = import.meta.glob<string>('../assets/cls63/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});

export interface ResolvedImage {
  src: string;
  srcSet?: string;
}

const table = new Map<string, { base?: string; variants: { w: number; url: string }[] }>();

for (const [path, url] of Object.entries(modules)) {
  const name = path.split('/').pop()!.replace(/\.[a-z]+$/i, '');
  const m = name.match(/^(.*)-(\d+)w$/);
  const key = m ? m[1] : name;
  const entry = table.get(key) ?? { variants: [] };
  if (m) entry.variants.push({ w: Number(m[2]), url });
  else entry.base = url;
  table.set(key, entry);
}

export function resolveImage(file: string, intrinsicWidth: number): ResolvedImage | null {
  const entry = table.get(file);
  if (!entry || (!entry.base && entry.variants.length === 0)) return null;
  const variants = [...entry.variants];
  if (entry.base) variants.push({ w: intrinsicWidth, url: entry.base });
  variants.sort((a, b) => a.w - b.w);
  const largest = variants[variants.length - 1];
  return {
    src: entry.base ?? largest.url,
    srcSet: variants.length > 1 ? variants.map((v) => `${v.url} ${v.w}w`).join(', ') : undefined,
  };
}
