import { useEffect, useMemo, useRef, useState } from 'react';
import { Ellipsis, GlassWater, Plus, Search } from 'lucide-react';
import BubblesMark, { GroupMark } from '../components/BubblesMark';
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

/** The stagger stops counting after this many rows, so a long book still arrives quickly. */
const STAGGER_CAP = 12;

function DrinkRow({
  drink,
  place,
  onOpen,
}: {
  drink: Drink;
  place: number | null;
  onOpen: () => void;
}) {
  const count = drink.ingredients.filter((row) => row.name.trim() !== '').length;
  return (
    <button
      type="button"
      onClick={onOpen}
      className={
        'sticker press flex min-h-18 w-full items-center justify-between gap-3 rounded-md ' +
        'px-4 py-3 text-left ' +
        (place === null ? '' : 'enter')
      }
      style={
        place === null
          ? undefined
          : { animationDelay: Math.min(place, STAGGER_CAP) * 30 + 'ms' }
      }
    >
      <span className="min-w-0">
        <span className="block truncate font-display text-22 font-medium text-ink">
          {drink.name === '' ? 'Untitled drink' : drink.name}
        </span>
        <span className="block text-15 text-muted">
          {count === 1 ? '1 ingredient' : count + ' ingredients'}
        </span>
      </span>
      {hasGlassFigures(drink) ? (
        <span className="inline-flex shrink-0 items-center gap-1.5 text-13 font-bold text-muted">
          <GlassWater size={16} aria-hidden="true" />
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

  // The list rises into place on the first render and never again: once the screen has
  // been mounted the class is gone, so a keystroke in the search never replays it.
  const mounted = useRef(false);
  const entering = !mounted.current;
  useEffect(() => {
    mounted.current = true;
  }, []);

  const found = useMemo(
    () => drinks.filter((drink) => matchesQuery(drink, query)),
    [drinks, query],
  );
  const sections = useMemo(() => sectionsFor(found, groupOrder), [found, groupOrder]);

  // One running count down the whole list, so the stagger reads as a single arrival
  // rather than restarting inside every group.
  const places = useMemo(() => {
    const order = new Map<string, number>();
    let next = 0;
    for (const section of sections) {
      for (const drink of section.drinks) {
        order.set(section.key + ':' + drink.id, next);
        next += 1;
      }
    }
    return order;
  }, [sections]);

  const isEmpty = drinks.length === 0;
  const nothingFound = !isEmpty && found.length === 0;

  return (
    <main
      className="mx-auto w-full max-w-[560px] px-4"
      style={{
        paddingTop: 'max(1rem, env(safe-area-inset-top))',
        paddingBottom: 'calc(2.5rem + env(safe-area-inset-bottom))',
      }}
    >
      <header className="relative isolate">
        <BubblesMark
          size={120}
          className="pointer-events-none absolute -top-13 -left-5 z-0"
        />
        <div className="relative z-10 flex min-h-16 items-end justify-between gap-3">
          <h1 className="text-44 leading-none text-ink">Bubbles</h1>
          <div className="flex shrink-0 items-center gap-2">
            {isEmpty ? null : (
              <button
                type="button"
                onClick={onAddDrink}
                className="sticker sticker-accent press inline-flex min-h-11 items-center gap-1.5 rounded-md px-3"
              >
                <Plus size={18} aria-hidden="true" />
                <span className="text-15 font-bold">Add</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenMore}
              className="sticker press inline-flex min-h-11 items-center gap-1.5 rounded-md px-3 text-accent-deep"
            >
              <Ellipsis size={18} aria-hidden="true" />
              <span className="text-15 font-bold">More</span>
            </button>
          </div>
        </div>
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
            Add
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
                  className="pointer-events-none absolute top-1/2 left-4 z-10 -translate-y-1/2 text-muted"
                />
                <input
                  id="search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Drink or ingredient"
                  autoComplete="off"
                  className={inputClass + ' field-lead'}
                />
              </div>
            </Field>
          </div>

          {nothingFound ? (
            <p className="mt-10 text-17 text-muted">Nothing matches that yet.</p>
          ) : null}

          {sections.map((section) => (
            <section key={section.key} className="mt-10">
              <h2 className="mb-3 flex items-center gap-2 text-24 text-ink">
                <GroupMark className="shrink-0" />
                {section.heading}
              </h2>
              <ul className="flex flex-col gap-3">
                {section.drinks.map((drink) => {
                  const key = section.key + ':' + drink.id;
                  return (
                    <li key={key}>
                      <DrinkRow
                        drink={drink}
                        place={entering ? (places.get(key) ?? 0) : null}
                        onOpen={() => onOpenDrink(drink.id)}
                      />
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}

          {needsBackup ? (
            <p className="mt-10 text-15 text-muted">
              There are edits since your last backup.
            </p>
          ) : null}
        </>
      )}
    </main>
  );
}
