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

/** The glass column, and the glass mark on Home, show when any row has a glass figure. */
export function hasGlassFigures(drink: Drink): boolean {
  return drink.ingredients.some((row) => row.glass.trim() !== '');
}

/** A drink gets the Full and Half switch when any row carries a figure, jar or glass. */
export function hasFigures(drink: Drink): boolean {
  return drink.ingredients.some((row) => row.jar.trim() !== '' || row.glass.trim() !== '');
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

/** Her spreadsheet's shorthand for makgeolli, as in "Peach mak.g mix". */
const MAKGEOLLI_SHORTHAND = /\bmak\.g\b/gi;

function hasShorthand(value: string): boolean {
  return value.search(MAKGEOLLI_SHORTHAND) !== -1;
}

/** The word written in full. The casing rules lift it afterwards wherever they would. */
function inFull(value: string): string {
  return value.replace(MAKGEOLLI_SHORTHAND, 'makgeolli');
}

/**
 * The whole book brought up to the rules: the shorthand written in full in every drink
 * name and ingredient name, and every name cased as a save would case it. An ingredient
 * written in the shorthand never met its preparation, so "Peach mak.g mix" stayed plain
 * text beside a "Peach Makgeolli Mix" she could have tapped through to. Once it is in full
 * and is exactly a preparation, it takes that preparation's name as it is stored.
 *
 * It runs when the book is read back from the phone, when a drink is saved and when a file
 * is restored, because the rules arrived after her first file was already on the phone and
 * a link can appear the moment either end of it is saved. Reports whether anything changed,
 * so the caller writes the book back only when it has to.
 */
export function tidyDrinks(drinks: Drink[]): { drinks: Drink[]; changed: boolean } {
  const cased = drinks.map((drink) =>
    capitaliseDrink({
      ...drink,
      name: inFull(drink.name),
      ingredients: drink.ingredients.map((row) => ({ ...row, name: inFull(row.name) })),
    }),
  );
  const preparations = cased.filter(isPreparation);

  let changed = false;
  const tidy = drinks.map((drink, at) => {
    const next = cased[at] ?? drink;
    const ingredients = next.ingredients.map((row, i) => {
      if (!hasShorthand(drink.ingredients[i]?.name ?? '')) return row;
      const name = preparationFor(preparations, row.name)?.name.trim() ?? row.name;
      return name === row.name ? row : { ...row, name };
    });
    if (
      next.name !== drink.name ||
      next.group !== drink.group ||
      ingredients.some((row, i) => row.name !== drink.ingredients[i]?.name)
    ) {
      changed = true;
      return { ...next, ingredients };
    }
    return drink;
  });
  return { drinks: changed ? tidy : drinks, changed };
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
