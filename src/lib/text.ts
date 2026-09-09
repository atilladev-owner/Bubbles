/**
 * Names always start with a capital. Drink and group names are title cased, ingredient
 * names lift their first letter only. Both rules run when a drink is saved and when a
 * backup is restored, never when something is drawn, so what is shown is what is stored.
 */

/** Small words stay small unless they open the name. */
const SMALL_WORDS = new Set(['and', 'or', 'of', 'with', '&']);

/**
 * A word that already carries a capital somewhere after its first letter was written
 * that way on purpose, so it is left exactly as it is. That is what keeps "iPhone" and
 * a shouted "MAKGEOLLI" from being tidied into something she did not type.
 */
function isDeliberate(word: string): boolean {
  return /[A-Z]/.test(word.slice(1));
}

function lift(word: string): string {
  if (word === '' || isDeliberate(word)) return word;
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function titleCase(value: string): string {
  let seenWord = false;
  return value
    .split(/(\s+)/)
    .map((part) => {
      if (part === '' || /^\s+$/.test(part)) return part;
      const first = !seenWord;
      seenWord = true;
      if (!first && SMALL_WORDS.has(part.toLowerCase())) return part.toLowerCase();
      return lift(part);
    })
    .join('');
}

export function capitalise(value: string): string {
  const at = value.search(/\S/);
  if (at === -1) return value;
  const head = value.slice(0, at);
  const rest = value.slice(at);
  const firstWord = rest.split(/\s/, 1)[0] ?? '';
  if (isDeliberate(firstWord)) return value;
  return head + rest.charAt(0).toUpperCase() + rest.slice(1);
}
