import type { Drink, Ingredient } from '../types';
import { PREPARATIONS } from './storage';

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

/** Matches the drink name and any ingredient name, as she types. */
export function matchesQuery(drink: Drink, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (needle === '') return true;
  if (drink.name.toLowerCase().includes(needle)) return true;
  return drink.ingredients.some((row) => row.name.toLowerCase().includes(needle));
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

/** Favourites first, then every group in order, with empty groups left out. */
export function sectionsFor(drinks: Drink[], groupOrder: string[]): Section[] {
  const byName = (a: Drink, b: Drink) => a.name.localeCompare(b.name);
  const sections: Section[] = [];

  const favourites = drinks.filter((drink) => drink.favourite).sort(byName);
  if (favourites.length > 0) {
    sections.push({ key: 'favourites', heading: 'Favourites', drinks: favourites });
  }

  for (const group of groupOrder) {
    const inGroup = drinks.filter((drink) => drink.group === group).sort(byName);
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
