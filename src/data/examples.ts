import type { Drink } from '../types';

/**
 * The book ships with a small set of classic recipes so the screens have something
 * to show on a fresh phone. They are common bar drinks, not anyone's house recipes,
 * and they load only when the database is empty.
 */

const SEEDED_AT = '2026-01-01T00:00:00.000Z';

export const EXAMPLE_DRINKS: Drink[] = [
  {
    id: 'example-classic-margarita',
    name: 'Classic Margarita',
    group: 'Ritas',
    favourite: true,
    note: 'Shake hard with plenty of ice, strain into a chilled glass, salt half the rim.',
    ingredients: [
      { name: 'Tequila blanco', jar: '450g', glass: '45g' },
      { name: 'Triple sec', jar: '250g', glass: '25g' },
      { name: 'Lime juice', jar: '250g', glass: '25g' },
      { name: 'Simple syrup', jar: '100g', glass: '10g' },
      { name: 'Lime wheel', jar: '', glass: '1ea' },
      { name: 'Salt', jar: '', glass: 'to taste' },
    ],
    updatedAt: SEEDED_AT,
  },
  {
    id: 'example-whisky-highball',
    name: 'Whisky Highball',
    group: 'Highballs',
    favourite: true,
    note: 'Build in the glass over the ice spear, pour the soda down the spoon, one gentle lift.',
    ingredients: [
      { name: 'Whisky', jar: '500g', glass: '50g' },
      { name: 'Soda water', jar: '1000g', glass: '100g' },
      { name: 'Ice spear', jar: '', glass: '1ea (10cm)' },
      { name: 'Lemon peel', jar: '', glass: '1ea' },
    ],
    updatedAt: SEEDED_AT,
  },
  {
    id: 'example-strawberry-slush',
    name: 'Strawberry Slush',
    group: 'Slushes',
    favourite: false,
    note: 'Blend until it holds a soft peak, then keep it moving in the machine.',
    ingredients: [
      { name: 'Strawberry puree', jar: '400g', glass: '' },
      { name: 'Simple syrup', jar: '120g', glass: '' },
      { name: 'Lemon juice', jar: '60g', glass: '' },
      { name: 'Crushed ice', jar: '500g', glass: '' },
    ],
    updatedAt: SEEDED_AT,
  },
  {
    id: 'example-makgeolli-spritz',
    name: 'Makgeolli Spritz',
    group: 'Makgeolli',
    favourite: false,
    note: 'Roll the bottle end over end before opening, never shake it.',
    ingredients: [
      { name: 'Makgeolli', jar: '1 bottle', glass: '' },
      { name: 'Sparkling water', jar: '200g', glass: '' },
      { name: 'Simple syrup', jar: '40g', glass: '' },
      { name: 'Lime juice', jar: '30g', glass: '' },
    ],
    updatedAt: SEEDED_AT,
  },
  {
    id: 'example-lemonade',
    name: 'Lemonade',
    group: 'Ades',
    favourite: false,
    note: '',
    ingredients: [
      { name: 'Lemon juice', jar: '240g', glass: '' },
      { name: 'Simple syrup', jar: '200g', glass: '' },
      { name: 'Still water', jar: '700g', glass: '' },
    ],
    updatedAt: SEEDED_AT,
  },
  {
    id: 'example-soju-sunrise',
    name: 'Soju Sunrise',
    group: 'Soju',
    favourite: false,
    note: 'Pour the grenadine last and let it fall on its own.',
    ingredients: [
      { name: 'Soju', jar: '1 bottle', glass: '' },
      { name: 'Orange juice', jar: '400g', glass: '' },
      { name: 'Grenadine', jar: '60g', glass: '' },
    ],
    updatedAt: SEEDED_AT,
  },
  {
    id: 'example-simple-syrup',
    name: 'Simple Syrup',
    group: 'Preparations',
    favourite: false,
    note: 'Equal weights, stirred warm until clear. Keeps two weeks cold.',
    ingredients: [
      { name: 'Caster sugar', jar: '500g', glass: '' },
      { name: 'Hot water', jar: '500g', glass: '' },
    ],
    updatedAt: SEEDED_AT,
  },
  {
    id: 'example-grenadine',
    name: 'Grenadine',
    group: 'Preparations',
    favourite: false,
    note: 'Warm, never boil. The lemon juice is there to keep it bright.',
    ingredients: [
      { name: 'Pomegranate juice', jar: '500g', glass: '' },
      { name: 'Caster sugar', jar: '500g', glass: '' },
      { name: 'Lemon juice', jar: '15g', glass: '' },
    ],
    updatedAt: SEEDED_AT,
  },
];
