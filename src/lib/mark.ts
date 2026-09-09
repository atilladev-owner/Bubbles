/**
 * The identity: a small cluster of soft circles. Drawn once here, rendered inline
 * behind the wordmark on Home and rasterised to the app icon sizes by the script
 * under scripts/. It carries no text and it never animates.
 */

export const MARK_GROUND = '#FFF7F9';
export const MARK_BUBBLE = '#F6C6D6';
export const MARK_WASH = '#FCE8EF';

export type MarkCircle = { cx: number; cy: number; r: number; fill: string };

/**
 * Five circles on a 512 square, kept apart so they read as bubbles rather than a
 * blob, and kept inside the maskable safe area.
 */
export const MARK_CIRCLES: MarkCircle[] = [
  { cx: 189, cy: 311, r: 104, fill: MARK_BUBBLE },
  { cx: 341, cy: 217, r: 68, fill: MARK_BUBBLE },
  { cx: 229, cy: 149, r: 52, fill: MARK_BUBBLE },
  { cx: 345, cy: 369, r: 40, fill: MARK_WASH },
  { cx: 137, cy: 157, r: 34, fill: MARK_WASH },
];

export const MARK_VIEWBOX = '0 0 512 512';

/** The same cluster as a standalone file, for the icons and the favicon. */
export function markSvg(withGround: boolean): string {
  const ground = withGround
    ? '<rect width="512" height="512" fill="' + MARK_GROUND + '"/>'
    : '';
  const circles = MARK_CIRCLES.map(
    (c) => '<circle cx="' + c.cx + '" cy="' + c.cy + '" r="' + c.r + '" fill="' + c.fill + '"/>',
  ).join('');
  return (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' +
    MARK_VIEWBOX +
    '" width="512" height="512">' +
    ground +
    circles +
    '</svg>'
  );
}
