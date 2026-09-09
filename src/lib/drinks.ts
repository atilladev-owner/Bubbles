import type { Drink, Ingredient } from '../types';
import { PREPARATIONS } from './storage';
import { capitalise, titleCase } from './text';

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return 'd' + Date.now().toString(36) + Math.random().toString(36).slice(2, 10);
}

export function emptyIngredient(): Ingredient {
  return { name: '', jar: '', glass: '' };
}

export function emptyDrink(group: string): Drink {
  return {
    id: newId(),
    name: '',
    group,
    favourite: false,
    note: '',
    ingredients: [emptyIngredient()],
    updatedAt: new Date().toISOString(),
  };
}

/** A drink can be halved only when at least one ingredient carries a glass figure. */
export function hasGlassFigures(drink: Drink): boolean {
  return drink.ingredients.some((row) => row.glass.trim() !== '');
}

export function isPreparation(drink: Drink): boolean {
  return drink.group === PREPARATIONS;
}

/** The words of a name, so a query can match the start of any one of them. */
function words(value: string): string[] {
  return value.split(/[^a-z0-9]+/i).filter((word) => word !== '');
}

/**
 * How well one drink answers a query, best first: the name starts with it, a word inside
 * the name starts with it, an ingredient starts with it, the name holds it anywhere, an
 * ingredient holds it anywhere. Null when the drink does not answer at all.
 */
function rankOf(drink: Drink, needle: string): number | null {
  const name = drink.name.toLowerCase();
  if (name.startsWith(needle)) return 1;
  if (words(name).some((word) => word.startsWith(needle))) return 2;

  const ingredients = drink.ingredients.map((row) => row.name.toLowerCase());
  if (ingredients.some((row) => row.startsWith(needle))) return 3;
  if (name.includes(needle)) return 4;
  if (ingredients.some((row) => row.includes(needle))) return 5;

  return null;
}

/** Matches the drink name and any ingredient name, as she types. */
export function matchesQuery(drink: Drink, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === '') return true;
  return rankOf(drink, needle) !== null;
}

/**
 * The drinks that answer the query, best match first. Ties keep the order they were
 * given, so a list she has arranged stays arranged inside a rank.
 */
export function rankDrinks(drinks: Drink[], query: string): Drink[] {
  const needle = query.trim().toLowerCase();
  if (needle === '') return drinks;

  const found: { drink: Drink; rank: number; place: number }[] = [];
  drinks.forEach((drink, place) => {
    const rank = rankOf(drink, needle);
    if (rank !== null) found.push({ drink, rank, place });
  });

  return found
    .sort((a, b) => a.rank - b.rank || a.place - b.place)
    .map((entry) => entry.drink);
}

/**
 * The drink as it is stored: the name and the group title cased, every ingredient name
 * lifted to a capital. Everything else, the note and every figure included, is left as
 * it was typed.
 */
export function capitaliseDrink(drink: Drink): Drink {
  return {
    ...drink,
    name: titleCase(drink.name),
    group: titleCase(drink.group),
    ingredients: drink.ingredients.map((row) => ({ ...row, name: capitalise(row.name) })),
  };
}

/** The stored order first, then any group she added, and Preparations always last. */
export function orderGroups(drinks: Drink[], stored: string[]): string[] {
  const seen = new Set<string>();
  const ordered: string[] = [];
  for (const group of stored) {
    if (group !== PREPARATIONS && !seen.has(group)) {
      seen.add(group);
      ordered.push(group);
    }
  }
  for (const drink of drinks) {
    if (drink.group !== PREPARATIONS && !seen.has(drink.group)) {
      seen.add(drink.group);
      ordered.push(drink.group);
    }
  }
  ordered.push(PREPARATIONS);
  return ordered;
}

export type Section = { key: string; heading: string; drinks: Drink[] };

/**
 * Favourites first, then every group in order, with empty groups left out. A favourite
 * shows once, under Favourites, and not again inside its own group.
 */
export function sectionsFor(drinks: Drink[], groupOrder: string[]): Section[] {
  const byName = (a: Drink, b: Drink) => a.name.localeCompare(b.name);
  const sections: Section[] = [];

  const favourites = drinks.filter((drink) => drink.favourite).sort(byName);
  if (favourites.length > 0) {
    sections.push({ key: 'favourites', heading: 'Favourites', drinks: favourites });
  }

  for (const group of groupOrder) {
    const inGroup = drinks
      .filter((drink) => drink.group === group && !drink.favourite)
      .sort(byName);
    if (inGroup.length > 0) {
      sections.push({ key: 'group:' + group, heading: group, drinks: inGroup });
    }
  }

  return sections;
}

/** An ingredient name that is exactly a preparation, ignoring case, links to it. */
export function preparationFor(drinks: Drink[], ingredientName: string): Drink | undefined {
  const needle = ingredientName.trim().toLowerCase();
  if (needle === '') return undefined;
  return drinks.find((drink) => isPreparation(drink) && drink.name.trim().toLowerCase() === needle);
}
