import { describe, expect, it } from 'vitest';
import { matchesQuery, orderGroups, sectionsFor } from './drinks';
import { DEFAULT_GROUPS } from './storage';
import type { Drink } from '../types';

function drink(name: string, group: string, favourite: boolean, ingredient = ''): Drink {
  return {
    id: name.toLowerCase().replace(/\s+/g, '-'),
    name,
    group,
    favourite,
    note: '',
    ingredients: ingredient === '' ? [] : [{ name: ingredient, jar: '10g', glass: '' }],
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

const margarita = drink('Classic Margarita', 'Ritas', true, 'Lime juice');
const tommys = drink('Tommys Margarita', 'Ritas', false, 'Agave syrup');
const highball = drink('Whisky Highball', 'Highballs', true, 'Soda water');
const syrup = drink('Simple Syrup', 'Preparations', false, 'Caster sugar');

const headings = (drinks: Drink[]) =>
  sectionsFor(drinks, orderGroups(drinks, DEFAULT_GROUPS)).map((section) => [
    section.heading,
    section.drinks.map((d) => d.name),
  ]);

describe('sectionsFor', () => {
  it('puts favourites first and leaves them out of their own group', () => {
    expect(headings([margarita, tommys])).toEqual([
      ['Favourites', ['Classic Margarita']],
      ['Ritas', ['Tommys Margarita']],
    ]);
  });

  it('drops a group whose only drinks are favourites', () => {
    expect(headings([margarita, highball])).toEqual([
      ['Favourites', ['Classic Margarita', 'Whisky Highball']],
    ]);
  });

  it('shows a drink once and only once', () => {
    const shown = headings([margarita, tommys, highball, syrup]).flatMap(
      ([, names]) => names,
    );
    expect(shown).toHaveLength(new Set(shown).size);
    expect(shown).toHaveLength(4);
  });

  it('keeps Preparations last', () => {
    expect(headings([syrup, tommys, margarita]).map(([heading]) => heading)).toEqual([
      'Favourites',
      'Ritas',
      'Preparations',
    ]);
  });

  it('has no sections at all when there are no drinks', () => {
    expect(headings([])).toEqual([]);
  });
});

describe('search feeding the sections', () => {
  const all = [margarita, tommys, highball, syrup];
  const search = (query: string) => headings(all.filter((d) => matchesQuery(d, query)));

  it('still reaches a favourite, under Favourites', () => {
    expect(search('classic')).toEqual([['Favourites', ['Classic Margarita']]]);
  });

  it('still reaches a drink inside a group', () => {
    expect(search('tommys')).toEqual([['Ritas', ['Tommys Margarita']]]);
  });

  it('matches an ingredient name on a favourite', () => {
    expect(search('soda')).toEqual([['Favourites', ['Whisky Highball']]]);
  });

  it('matches across a favourite and a group at once', () => {
    expect(search('margarita')).toEqual([
      ['Favourites', ['Classic Margarita']],
      ['Ritas', ['Tommys Margarita']],
    ]);
  });
});
