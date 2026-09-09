import type { Backup, Drink, Ingredient } from '../types';
import { newId } from './drinks';

export function backupFilename(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  const stamp = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate());
  return 'bubbles-backup-' + stamp + '.json';
}

export function toBackup(drinks: Drink[], now: Date): Backup {
  return { app: 'bubbles', version: 1, exportedAt: now.toISOString(), drinks };
}

function text(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

function ingredientFrom(value: unknown): Ingredient {
  const row = (value ?? {}) as Record<string, unknown>;
  return { name: text(row['name']), jar: text(row['jar']), glass: text(row['glass']) };
}

function drinkFrom(value: unknown): Drink {
  const raw = (value ?? {}) as Record<string, unknown>;
  const ingredients = Array.isArray(raw['ingredients']) ? raw['ingredients'] : [];
  return {
    id: text(raw['id']) || newId(),
    name: text(raw['name']),
    group: text(raw['group']) || 'Ritas',
    favourite: raw['favourite'] === true,
    note: text(raw['note']),
    ingredients: ingredients.map(ingredientFrom),
    updatedAt: text(raw['updatedAt']) || new Date().toISOString(),
  };
}

/**
 * Reads a file she picked. It is untrusted text, so every field is taken back to a
 * known shape rather than believed. Returns null when the file is not a Bubbles backup.
 */
export function parseBackup(source: string): Drink[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(source);
  } catch {
    return null;
  }
  if (typeof parsed !== 'object' || parsed === null) return null;
  const backup = parsed as Record<string, unknown>;
  if (backup['app'] !== 'bubbles') return null;
  if (backup['version'] !== 1) return null;
  if (!Array.isArray(backup['drinks'])) return null;
  return backup['drinks'].map(drinkFrom);
}
