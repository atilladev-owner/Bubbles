import { useMemo, useState } from 'react';
import { Ellipsis, GlassWater, Plus, Search } from 'lucide-react';
import BubblesMark from '../components/BubblesMark';
import Button from '../components/Button';
import Field, { inputClass } from '../components/Field';
import InstallHint from '../components/InstallHint';
import { hasGlassFigures, matchesQuery, sectionsFor } from '../lib/drinks';
import type { Drink } from '../types';

type Props = {
  drinks: Drink[];
  groupOrder: string[];
  needsBackup: boolean;
  showInstallHint: boolean;
  onDismissInstallHint: () => void;
  onOpenDrink: (id: string) => void;
  onAddDrink: () => void;
  onOpenMore: () => void;
};

function DrinkRow({ drink, onOpen }: { drink: Drink; onOpen: () => void }) {
  const count = drink.ingredients.filter((row) => row.name.trim() !== '').length;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex min-h-16 w-full items-center justify-between gap-3 rounded-md bg-panel px-4 py-3 text-left shadow-row press active:scale-[0.98] active:bg-wash"
    >
      <span className="min-w-0">
        <span className="block truncate font-display text-20 font-medium text-ink">
          {drink.name === '' ? 'Untitled drink' : drink.name}
        </span>
        <span className="block text-13 text-muted">
          {count === 1 ? '1 ingredient' : count + ' ingredients'}
        </span>
      </span>
      {hasGlassFigures(drink) ? (
        <span className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-wash px-2 py-1 text-13 font-bold text-accent-deep">
          <GlassWater size={14} aria-hidden="true" />
          glass
        </span>
      ) : null}
    </button>
  );
}

export default function Home({
  drinks,
  groupOrder,
  needsBackup,
  showInstallHint,
  onDismissInstallHint,
  onOpenDrink,
  onAddDrink,
  onOpenMore,
}: Props) {
  const [query, setQuery] = useState('');

  const found = useMemo(
    () => drinks.filter((drink) => matchesQuery(drink, query)),
    [drinks, query],
  );
  const sections = useMemo(() => sectionsFor(found, groupOrder), [found, groupOrder]);

  const isEmpty = drinks.length === 0;
  const nothingFound = !isEmpty && found.length === 0;

  return (
    <div
      className="mx-auto w-full max-w-[560px] px-4 pb-32"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <header className="flex items-center justify-between gap-4">
        <div className="relative isolate flex h-26 items-center">
          <BubblesMark size={96} className="pointer-events-none absolute top-0 -left-4 z-0" />
          <h1 className="relative z-10 text-38 leading-none text-ink">Bubbles</h1>
        </div>
        <button
          type="button"
          onClick={onOpenMore}
          className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-line bg-panel px-3 text-muted press active:scale-[0.98] active:bg-wash"
        >
          <Ellipsis size={18} aria-hidden="true" />
          <span className="text-15 font-bold">More</span>
        </button>
      </header>

      {showInstallHint ? <InstallHint onDismiss={onDismissInstallHint} /> : null}

      {isEmpty ? (
        <div className="mt-16 flex flex-col items-center gap-6 text-center">
          <BubblesMark size={160} />
          <p className="text-17 text-muted">
            No drinks yet. Add the first one and it stays on this phone.
          </p>
          <Button onClick={onAddDrink}>
            <Plus size={18} aria-hidden="true" />
            Add drink
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-6">
            <Field label="Search" htmlFor="search">
              <div className="relative">
                <Search
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                />
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Drink or ingredient"
                  autoComplete="off"
                  className={inputClass + ' pl-10'}
                />
              </div>
            </Field>
          </div>

          {nothingFound ? (
            <p className="mt-8 text-17 text-muted">Nothing matches that yet.</p>
          ) : null}

          {sections.map((section) => (
            <section key={section.key} className="mt-6">
              <h2 className="mb-2 text-15 text-muted">{section.heading}</h2>
              <ul className="flex flex-col gap-2">
                {section.drinks.map((drink) => (
                  <li key={section.key + ':' + drink.id}>
                    <DrinkRow drink={drink} onOpen={() => onOpenDrink(drink.id)} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

          {needsBackup ? (
            <p className="mt-8 text-15 text-muted">
              There are edits since your last backup.
            </p>
          ) : null}
        </>
      )}

      {isEmpty ? null : (
        <div
          className="fixed right-4 z-10"
          style={{ bottom: 'calc(1rem + env(safe-area-inset-bottom))' }}
        >
          <Button onClick={onAddDrink}>
            <Plus size={18} aria-hidden="true" />
            Add drink
          </Button>
        </div>
      )}
    </div>
  );
}
