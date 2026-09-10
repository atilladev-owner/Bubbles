import { describe, expect, it } from 'vitest';
import { capitaliseDrink, matchesQuery, orderGroups, rankDrinks, sectionsFor, tidyDrinks } from './drinks';
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

describe('rankDrinks', () => {
  // One drink for each of the five ranks, deliberately out of order in the list.
  const fizz = drink('Gin Fizz', 'Highballs', false, 'Rhubarb syrup'); // ingredient contains
  const punch = drink('Milk Punch', 'Highballs', false, 'Banana milk'); // ingredient starts
  const tall = drink('Whisky Highball', 'Highballs', false, 'Soda water'); // name contains
  const breeze = drink('Bay Breeze', 'Highballs', false, 'Cranberry juice'); // name starts
  const ade = drink('Strawberry Basil Ade', 'Ades', false, 'Lemon juice'); // a word starts
  const all = [fizz, punch, tall, breeze, ade];
  const names = (query: string) => rankDrinks(all, query).map((found) => found.name);

  it('puts the best match first and keeps all five ranks in order', () => {
    expect(names('ba')).toEqual([
      'Bay Breeze',
      'Strawberry Basil Ade',
      'Milk Punch',
      'Whisky Highball',
      'Gin Fizz',
    ]);
  });

  it('surfaces everything starting with the query from the first letters', () => {
    expect(names('b')).toContain('Bay Breeze');
    expect(names('b')[0]).toBe('Bay Breeze');
  });

  it('does not care about case', () => {
    expect(names('BA')).toEqual(names('ba'));
  });

  it('ignores whitespace padding', () => {
    expect(names('  ba  ')).toEqual(names('ba'));
  });

  it('keeps the list order inside one rank', () => {
    const first = drink('Lemon Ade', 'Ades', false, '');
    const second = drink('Lemon Slush', 'Slushes', false, '');
    expect(rankDrinks([first, second], 'lemon').map((d) => d.name)).toEqual([
      'Lemon Ade',
      'Lemon Slush',
    ]);
    expect(rankDrinks([second, first], 'lemon').map((d) => d.name)).toEqual([
      'Lemon Slush',
      'Lemon Ade',
    ]);
  });

  it('returns everything, in list order, for an empty query', () => {
    expect(rankDrinks(all, '')).toEqual(all);
    expect(rankDrinks(all, '   ')).toEqual(all);
  });

  it('returns nothing when nothing matches', () => {
    expect(rankDrinks(all, 'zzz')).toEqual([]);
  });

  it('agrees with the match that feeds the sections', () => {
    for (const query of ['ba', 'lime', 'soda', 'zzz', 'margarita']) {
      const ranked = rankDrinks(all, query).length;
      const matched = all.filter((d) => matchesQuery(d, query)).length;
      expect(ranked).toBe(matched);
    }
  });
});

describe('capitaliseDrink', () => {
  it('title cases the name and the group and lifts every ingredient', () => {
    const rough: Drink = {
      id: 'rough',
      name: 'jim beam & coke',
      group: 'highballs and more',
      favourite: false,
      note: 'left exactly as it was typed',
      ingredients: [
        { name: 'jim beam', jar: '50g', glass: '' },
        { name: 'peach mak.g mix', jar: '', glass: '10g' },
      ],
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    expect(capitaliseDrink(rough)).toEqual({
      ...rough,
      name: 'Jim Beam & Coke',
      group: 'Highballs and More',
      ingredients: [
        { name: 'Jim beam', jar: '50g', glass: '' },
        { name: 'Peach mak.g mix', jar: '', glass: '10g' },
      ],
    });
  });

  it('is pure and does not touch the drink it was given', () => {
    const rough = drink('soda water', 'ades', false, 'soda water');
    capitaliseDrink(rough);
    expect(rough.name).toBe('soda water');
    expect(rough.ingredients[0]?.name).toBe('soda water');
  });
});

describe('tidyDrinks', () => {
  it('reports nothing to do when every name already follows the rules', () => {
    const tidy = [drink('Jim Beam & Coke', 'Highballs', false, 'Soda water')];
    const result = tidyDrinks(tidy);
    expect(result.changed).toBe(false);
    expect(result.drinks).toEqual(tidy);
  });

  it('brings a book stored before the rules existed up to them', () => {
    const rough = [
      drink('jim beam & coke', 'Highballs', false, 'soda water'),
      drink('Shark Rita', 'Ritas', true, 'shark mix'),
    ];
    const result = tidyDrinks(rough);
    expect(result.changed).toBe(true);
    expect(result.drinks.map((d) => d.name)).toEqual(['Jim Beam & Coke', 'Shark Rita']);
    expect(result.drinks.map((d) => d.ingredients[0]?.name)).toEqual(['Soda water', 'Shark mix']);
  });

  it('leaves what it was given untouched', () => {
    const rough = [drink('jim beam & coke', 'Highballs', false, 'soda water')];
    tidyDrinks(rough);
    expect(rough[0]?.name).toBe('jim beam & coke');
    expect(rough[0]?.ingredients[0]?.name).toBe('soda water');
  });
});
