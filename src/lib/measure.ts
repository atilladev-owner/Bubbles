/**
 * The halving rules. Pure, and the only place a measurement is ever transformed.
 *
 * A glass figure is halvable when it opens with a number and the text after that
 * number is not a unit that cannot be split. Counts and lengths cannot be split,
 * so "1ea" and "10cm" come back as written; grams and bottles can, so "83g" and
 * "1 bottle" are halved.
 */

export type Halved = { value: string; asWritten: boolean };

/** Units that describe a count or a length, which halving would make nonsense of. */
const UNSPLITTABLE_UNITS = new Set(['ea', 'cm']);

const FIGURE = /^(\d+(?:\.\d+)?)(.*)$/s;

/** Rounds to the nearest 0.5, with an exact half rounding up. */
function toNearestHalf(n: number): number {
  return Math.round(n * 2) / 2;
}

/** Renders a number with no trailing zeros and no exponent. */
function render(n: number): string {
  if (Number.isInteger(n)) return n.toFixed(0);
  return n.toFixed(1);
}

export function halve(value: string): Halved {
  const trimmed = value.trim();
  const figure = FIGURE.exec(trimmed);
  if (!figure) return { value, asWritten: true };

  const [, digits = '', rest = ''] = figure;

  // The remainder has to read as a unit: nothing, a space, or letters. A slash or
  // any other symbol means this is a note rather than a figure we can halve.
  if (rest !== '' && !/^[\s a-zA-Z]/.test(rest)) return { value, asWritten: true };

  const unit = /^[a-zA-Z]+/.exec(rest.trimStart());
  if (unit && UNSPLITTABLE_UNITS.has(unit[0].toLowerCase())) {
    return { value, asWritten: true };
  }

  const amount = Number(digits);
  if (!Number.isFinite(amount)) return { value, asWritten: true };

  return { value: render(toNearestHalf(amount / 2)) + rest, asWritten: false };
}
