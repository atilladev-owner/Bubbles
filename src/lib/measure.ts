/**
 * The halving rules. Pure, and the only place a measurement is ever transformed.
 *
 * A figure, jar or glass, is halvable when it opens with a number and the unit after that
 * number is one that divides. The list of those units is closed, so anything the
 * book has not been told about comes back as written rather than being guessed at:
 * half a lemon wedge is not a thing she pours.
 */

export type Halved = { value: string; asWritten: boolean };

/** The units that divide. Nothing outside this list is ever halved. */
const SPLITTABLE_UNITS = new Set([
  'g',
  'kg',
  'mg',
  'ml',
  'cl',
  'dl',
  'l',
  'oz',
  'bottle',
  'bottles',
  'shot',
  'shots',
  'cup',
  'cups',
  'tsp',
  'tbsp',
]);

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

  const tail = rest.trimStart();
  if (tail !== '') {
    const unit = /^[a-zA-Z]+/.exec(tail);
    if (!unit) return { value, asWritten: true };
    if (!SPLITTABLE_UNITS.has(unit[0].toLowerCase())) return { value, asWritten: true };
  }

  const amount = Number(digits);
  if (!Number.isFinite(amount)) return { value, asWritten: true };

  return { value: render(toNearestHalf(amount / 2)) + rest, asWritten: false };
}

/**
 * A figure as the recipe shows it under the switch: exactly as she typed it on Full,
 * halved on Half. Jar and glass figures go through the same rules.
 */
export function measured(value: string, half: boolean): Halved {
  return half ? halve(value) : { value, asWritten: false };
}

/**
 * The gram figure inside a measurement, or null when the value is not a plain weight
 * in grams. The pour bars read this, and only this, so a count or a word draws no bar.
 */
export function grams(value: string): number | null {
  const match = /^(\d+(?:\.\d+)?)\s*g$/i.exec(value.trim());
  if (!match) return null;
  const amount = Number(match[1]);
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}
