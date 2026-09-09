import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Pencil } from 'lucide-react';
import Button from '../components/Button';
import FavouriteToggle from '../components/FavouriteToggle';
import { hasGlassFigures, preparationFor } from '../lib/drinks';
import { grams, halve } from '../lib/measure';
import type { Drink } from '../types';

type Props = {
  drink: Drink;
  drinks: Drink[];
  onBack: () => void;
  onEdit: () => void;
  onToggleFavourite: () => void;
  onOpenDrink: (id: string) => void;
};

const MEASURES = [
  { key: 'glass', label: 'Glass' },
  { key: 'half', label: 'Half glass' },
] as const;

function MeasureSwitch({ half, onChange }: { half: boolean; onChange: (half: boolean) => void }) {
  const reduce = useReducedMotion();
  return (
    <fieldset className="sticker press relative mt-6 grid grid-cols-2 gap-1 rounded-md p-1">
      <legend className="sr-only">Measure</legend>
      <motion.span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 rounded-sm bg-accent"
        style={{ width: 'calc(50% - 0.375rem)' }}
        animate={{ x: half ? 'calc(100% + 0.25rem)' : '0%' }}
        transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
      />
      {MEASURES.map((measure) => {
        const selected = (measure.key === 'half') === half;
        return (
          <label
            key={measure.key}
            className="relative z-10 flex min-h-11 cursor-pointer items-center justify-center rounded-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-deep"
          >
            <input
              type="radio"
              name="measure"
              className="sr-only"
              checked={selected}
              onChange={() => onChange(measure.key === 'half')}
            />
            <span className={'text-15 font-bold ' + (selected ? 'text-white' : 'text-muted')}>
              {measure.label}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

/**
 * A figure and, under it, its share of the largest gram figure in the same column, so
 * the ratios of a recipe read at a glance: three times the syrup is three times the bar.
 * A value that is not a weight, and a blank, draw nothing.
 */
function Figure({ text, largest, live }: { text: string; largest: number; live: boolean }) {
  const trimmed = text.trim();
  if (trimmed === '') return null;
  const weight = grams(text);
  const share = weight === null || largest <= 0 ? null : weight / largest;

  // A value that opens with a number is a measurement and is set like one. A value that
  // is a phrase, "to taste" among them, is read rather than measured, so it stays body text.
  if (!/^\d/.test(trimmed)) {
    return <span className="block text-17 break-words text-ink">{text}</span>;
  }

  return (
    <>
      <span className="block font-display text-28 font-medium tabular break-words text-ink">
        {text}
      </span>
      {share === null ? null : (
        <span
          aria-hidden="true"
          className={'mt-1.5 block h-1.5 ' + (live ? 'bg-accent' : 'bg-bubble')}
          style={{ width: 'max(4px, ' + (share * 100).toFixed(1) + '%)' }}
        />
      )}
    </>
  );
}

export default function DrinkView({
  drink,
  drinks,
  onBack,
  onEdit,
  onToggleFavourite,
  onOpenDrink,
}: Props) {
  const [half, setHalf] = useState(false);
  const showGlass = hasGlassFigures(drink);
  const rows = drink.ingredients.filter(
    (row) => row.name.trim() !== '' || row.jar.trim() !== '' || row.glass.trim() !== '',
  );

  const shown = rows.map((row) => ({
    row,
    glass: half ? halve(row.glass) : { value: row.glass, asWritten: false },
  }));
  const largestJar = Math.max(0, ...shown.map((item) => grams(item.row.jar) ?? 0));
  const largestGlass = Math.max(0, ...shown.map((item) => grams(item.glass.value) ?? 0));

  return (
    <main
      className="mx-auto w-full max-w-[560px] px-4 pb-16"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="quiet -ml-2 inline-flex min-h-11 items-center gap-1 px-2 text-muted"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          <span className="text-17 font-bold">Drinks</span>
        </button>
        <FavouriteToggle on={drink.favourite} onToggle={onToggleFavourite} />
      </div>

      <h1 className="mt-4 text-30 text-ink">
        {drink.name === '' ? 'Untitled drink' : drink.name}
      </h1>
      <p className="mt-1 text-15 text-muted">{drink.group}</p>

      {showGlass ? <MeasureSwitch half={half} onChange={setHalf} /> : null}

      <table className="mt-8 w-full table-fixed border-collapse">
        <caption className="sr-only">Ingredients for {drink.name}</caption>
        <colgroup>
          <col style={{ width: showGlass ? '40%' : '58%' }} />
          <col style={{ width: showGlass ? '30%' : '42%' }} />
          {showGlass ? <col style={{ width: '30%' }} /> : null}
        </colgroup>
        <thead>
          <tr className="border-b-2 border-wash">
            <th scope="col" className="pb-2 text-left font-display text-15 font-medium text-muted">
              Ingredient
            </th>
            <th scope="col" className="pb-2 text-left font-display text-15 font-medium text-muted">
              Jar
            </th>
            {showGlass ? (
              <th
                scope="col"
                className="pb-2 text-left font-display text-15 font-medium text-muted"
              >
                Glass
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {shown.map((item, index) => {
            const preparation = preparationFor(drinks, item.row.name);
            return (
              <tr
                key={item.row.name + ':' + index}
                className="border-b-2 border-wash align-top"
              >
                <td className="py-4 pr-3 text-17 break-words">
                  {preparation && preparation.id !== drink.id ? (
                    <button
                      type="button"
                      onClick={() => onOpenDrink(preparation.id)}
                      className="quiet -my-1 inline-flex min-h-11 items-center text-left text-accent underline underline-offset-2"
                    >
                      {item.row.name}
                    </button>
                  ) : (
                    item.row.name
                  )}
                </td>
                <td className="py-4 pr-3">
                  <Figure text={item.row.jar} largest={largestJar} live={false} />
                </td>
                {showGlass ? (
                  <td className="py-4">
                    <Figure text={item.glass.value} largest={largestGlass} live={true} />
                    {half && item.glass.asWritten && item.row.glass.trim() !== '' ? (
                      <span className="mt-1.5 block text-13 text-muted">as written</span>
                    ) : null}
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>

      {drink.note.trim() !== '' ? (
        <p className="mt-6 text-15 text-muted">{drink.note}</p>
      ) : null}

      <div className="mt-10">
        <Button tone="secondary" full onClick={onEdit}>
          <Pencil size={18} aria-hidden="true" />
          Edit
        </Button>
      </div>
    </main>
  );
}
