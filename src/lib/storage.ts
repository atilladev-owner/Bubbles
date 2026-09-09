import { get, set } from 'idb-keyval';
import type { Drink, Meta } from '../types';

const DRINKS_KEY = 'bubbles.drinks';
const GROUPS_KEY = 'bubbles.groups';
const META_KEY = 'bubbles.meta';

export const PREPARATIONS = 'Preparations';

/** The groups the book opens with, in the order she reads them. */
export const DEFAULT_GROUPS = [
  'Ritas',
  'Slushes',
  'Makgeolli',
  'Ades',
  'Soju',
  'Highballs',
  PREPARATIONS,
];

export const EMPTY_META: Meta = { changedAt: null, lastBackupAt: null };

export async function loadDrinks(): Promise<Drink[] | undefined> {
  return get<Drink[]>(DRINKS_KEY);
}

export async function saveDrinks(drinks: Drink[]): Promise<void> {
  await set(DRINKS_KEY, drinks);
}

export async function loadGroupOrder(): Promise<string[] | undefined> {
  return get<string[]>(GROUPS_KEY);
}

export async function saveGroupOrder(groups: string[]): Promise<void> {
  await set(GROUPS_KEY, groups);
}

export async function loadMeta(): Promise<Meta> {
  return (await get<Meta>(META_KEY)) ?? EMPTY_META;
}

export async function saveMeta(meta: Meta): Promise<void> {
  await set(META_KEY, meta);
}
