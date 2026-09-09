import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronLeft, Pencil } from 'lucide-react';
import Button from '../components/Button';
import FavouriteToggle from '../components/FavouriteToggle';
import { hasGlassFigures, preparationFor } from '../lib/drinks';
import { halve } from '../lib/measure';
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
    <fieldset className="relative mt-6 grid grid-cols-2 gap-1 rounded-md border-0 bg-wash p-1">
      <legend className="sr-only">Measure</legend>
      <motion.span
        aria-hidden="true"
        className="absolute top-1 bottom-1 left-1 rounded-sm bg-accent"
        style={{ width: 'calc(50% - 0.25rem)' }}
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

function Figure({ text }: { text: string }) {
  if (text.trim() === '') return null;
  return <span className="font-display text-24 tabular text-ink">{text}</span>;
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

  return (
    <div
      className="mx-auto w-full max-w-[560px] px-4 pb-16"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-sm px-2 text-accent press active:scale-[0.98] active:bg-wash"
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

      <table className="mt-6 w-full table-fixed border-collapse">
        <caption className="sr-only">Ingredients for {drink.name}</caption>
        <colgroup>
          <col style={{ width: showGlass ? '42%' : '58%' }} />
          <col style={{ width: showGlass ? '29%' : '42%' }} />
          {showGlass ? <col style={{ width: '29%' }} /> : null}
        </colgroup>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className="pb-2 text-left text-13 font-bold text-muted">
              Ingredient
            </th>
            <th scope="col" className="pb-2 text-left text-13 font-bold text-muted">
              Jar
            </th>
            {showGlass ? (
              <th scope="col" className="pb-2 text-left text-13 font-bold text-muted">
                Glass
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => {
            const preparation = preparationFor(drinks, row.name);
            const glass = half ? halve(row.glass) : { value: row.glass, asWritten: false };
            return (
              <tr key={row.name + ':' + index} className="border-b border-line align-top">
                <td className="py-3 pr-2 text-17 break-words">
                  {preparation && preparation.id !== drink.id ? (
                    <button
                      type="button"
                      onClick={() => onOpenDrink(preparation.id)}
                      className="text-left text-accent underline underline-offset-2"
                    >
                      {row.name}
                    </button>
                  ) : (
                    row.name
                  )}
                </td>
                <td className="py-3 pr-2 break-words">
                  <Figure text={row.jar} />
                </td>
                {showGlass ? (
                  <td className="py-3 break-words">
                    <Figure text={glass.value} />
                    {half && glass.asWritten && row.glass.trim() !== '' ? (
                      <span className="mt-1 block text-13 text-muted">as written</span>
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
        <Button tone="wash" full onClick={onEdit}>
          <Pencil size={18} aria-hidden="true" />
          Edit
        </Button>
      </div>
    </div>
  );
}
