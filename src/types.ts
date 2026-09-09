export type Ingredient = { name: string; jar: string; glass: string };

export type Drink = {
  id: string; // generated, never shown
  name: string;
  group: string;
  favourite: boolean;
  note: string;
  ingredients: Ingredient[];
  updatedAt: string; // ISO
};

export type Backup = {
  app: 'bubbles';
  version: 1;
  exportedAt: string;
  drinks: Drink[];
};

/** Bookkeeping that is not part of a drink: when the list last changed and last left the phone. */
export type Meta = {
  changedAt: string | null;
  lastBackupAt: string | null;
};
