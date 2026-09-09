import { describe, expect, it } from 'vitest';
import { backupFilename, parseBackup, toBackup } from './backup';
import type { Drink } from '../types';

const drink: Drink = {
  id: 'a',
  name: 'Lemonade',
  group: 'Ades',
  favourite: false,
  note: '',
  ingredients: [{ name: 'Lemon juice', jar: '240g', glass: '' }],
  updatedAt: '2026-01-01T00:00:00.000Z',
};

describe('backupFilename', () => {
  it('names the file for the local day', () => {
    expect(backupFilename(new Date(2026, 8, 9, 23, 30))).toBe('bubbles-backup-2026-09-09.json');
  });

  it('pads a single digit month and day', () => {
    expect(backupFilename(new Date(2026, 0, 5))).toBe('bubbles-backup-2026-01-05.json');
  });
});

describe('parseBackup', () => {
  it('reads back what it wrote', () => {
    const source = JSON.stringify(toBackup([drink], new Date('2026-01-02T00:00:00.000Z')));
    expect(parseBackup(source)).toEqual([drink]);
  });

  it('refuses text that is not JSON', () => {
    expect(parseBackup('not json')).toBeNull();
  });

  it('refuses a file from another app', () => {
    expect(parseBackup('{"app":"other","version":1,"drinks":[]}')).toBeNull();
  });

  it('refuses an unknown version', () => {
    expect(parseBackup('{"app":"bubbles","version":2,"drinks":[]}')).toBeNull();
  });

  it('refuses a file with no drinks array', () => {
    expect(parseBackup('{"app":"bubbles","version":1}')).toBeNull();
  });

  it('takes a malformed drink back to a known shape', () => {
    const restored = parseBackup(
      '{"app":"bubbles","version":1,"drinks":[{"name":42,"ingredients":"none","favourite":"yes"}]}',
    );
    expect(restored).toHaveLength(1);
    const first = restored?.[0];
    expect(first?.name).toBe('');
    expect(first?.favourite).toBe(false);
    expect(first?.ingredients).toEqual([]);
    expect(first?.id).not.toBe('');
  });
});
