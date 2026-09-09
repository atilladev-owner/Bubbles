import { useId, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronLeft, Plus, X } from 'lucide-react';
import Button from '../components/Button';
import FavouriteToggle from '../components/FavouriteToggle';
import Field, { inputClass } from '../components/Field';
import { emptyIngredient } from '../lib/drinks';
import { PREPARATIONS } from '../lib/storage';
import type { Drink, Ingredient } from '../types';

type Props = {
  drink: Drink;
  groups: string[];
  isNew: boolean;
  onSave: (drink: Drink) => void;
  onCancel: () => void;
  onDelete: () => void;
};

const NEW_GROUP = '__new__';

function move<T>(items: T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items;
  const next = items.slice();
  const [taken] = next.splice(from, 1);
  if (taken === undefined) return items;
  next.splice(to, 0, taken);
  return next;
}

export default function EditForm({ drink, groups, isNew, onSave, onCancel, onDelete }: Props) {
  const uid = useId();
  const [name, setName] = useState(drink.name);
  const [group, setGroup] = useState(drink.group);
  const [newGroup, setNewGroup] = useState('');
  const [addingGroup, setAddingGroup] = useState(false);
  const [favourite, setFavourite] = useState(drink.favourite);
  const [note, setNote] = useState(drink.note);
  const [ingredients, setIngredients] = useState<Ingredient[]>(
    drink.ingredients.length > 0 ? drink.ingredients : [emptyIngredient()],
  );
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [touched, setTouched] = useState(false);

  const chosenGroup = addingGroup ? newGroup.trim() : group;
  const nameIsEmpty = name.trim() === '';

  function updateIngredient(index: number, patch: Partial<Ingredient>) {
    setIngredients((rows) =>
      rows.map((row, i) => (i === index ? { ...row, ...patch } : row)),
    );
  }

  function submit() {
    setTouched(true);
    if (nameIsEmpty) return;
    onSave({
      ...drink,
      name: name.trim(),
      group: chosenGroup === '' ? drink.group : chosenGroup,
      favourite,
      note,
      ingredients,
      updatedAt: new Date().toISOString(),
    });
  }

  const groupOptions = groups.includes(group) ? groups : [group, ...groups];

  return (
    <div
      className="mx-auto w-full max-w-[560px] px-4 pb-16"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="-ml-2 inline-flex min-h-11 items-center gap-1 rounded-sm px-2 text-accent press active:scale-[0.98] active:bg-wash active:text-accent-deep"
        >
          <ChevronLeft size={20} aria-hidden="true" />
          <span className="text-17 font-bold">Back</span>
        </button>
        <FavouriteToggle on={favourite} onToggle={() => setFavourite((on) => !on)} />
      </div>

      <h1 className="mt-4 text-30 text-ink">{isNew ? 'New drink' : 'Edit drink'}</h1>

      <form
        className="mt-6 flex flex-col gap-5"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <Field
          label="Name"
          htmlFor={uid + '-name'}
          hint={touched && nameIsEmpty ? 'A drink needs a name before it can be saved.' : ''}
        >
          <input
            id={uid + '-name'}
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={inputClass}
            autoComplete="off"
          />
        </Field>

        <Field label="Group" htmlFor={uid + '-group'}>
          <select
            id={uid + '-group'}
            value={addingGroup ? NEW_GROUP : group}
            onChange={(event) => {
              const value = event.target.value;
              if (value === NEW_GROUP) {
                setAddingGroup(true);
              } else {
                setAddingGroup(false);
                setGroup(value);
              }
            }}
            className={inputClass}
          >
            {groupOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value={NEW_GROUP}>New group</option>
          </select>
        </Field>

        {addingGroup ? (
          <Field label="New group name" htmlFor={uid + '-new-group'}>
            <input
              id={uid + '-new-group'}
              value={newGroup}
              onChange={(event) => setNewGroup(event.target.value)}
              className={inputClass}
              autoComplete="off"
            />
          </Field>
        ) : null}

        <Field label="Note" htmlFor={uid + '-note'}>
          <textarea
            id={uid + '-note'}
            value={note}
            rows={3}
            onChange={(event) => setNote(event.target.value)}
            className={inputClass}
          />
        </Field>

        <section className="flex flex-col gap-3">
          <h2 className="text-15 text-muted">Ingredients</h2>
          {ingredients.map((row, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-lg border border-line bg-panel p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-13 font-bold text-muted">Row {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    aria-label={'Move row ' + (index + 1) + ' up'}
                    disabled={index === 0}
                    onClick={() => setIngredients((rows) => move(rows, index, index - 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-muted press active:scale-[0.98] active:bg-wash disabled:opacity-40"
                  >
                    <ArrowUp size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={'Move row ' + (index + 1) + ' down'}
                    disabled={index === ingredients.length - 1}
                    onClick={() => setIngredients((rows) => move(rows, index, index + 1))}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-muted press active:scale-[0.98] active:bg-wash disabled:opacity-40"
                  >
                    <ArrowDown size={18} aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label={'Remove row ' + (index + 1)}
                    onClick={() =>
                      setIngredients((rows) => {
                        const next = rows.filter((_, i) => i !== index);
                        return next.length > 0 ? next : [emptyIngredient()];
                      })
                    }
                    className="inline-flex h-11 w-11 items-center justify-center rounded-sm text-muted press active:scale-[0.98] active:bg-wash"
                  >
                    <X size={18} aria-hidden="true" />
                  </button>
                </div>
              </div>

              <Field label="Ingredient" htmlFor={uid + '-name-' + index}>
                <input
                  id={uid + '-name-' + index}
                  value={row.name}
                  onChange={(event) => updateIngredient(index, { name: event.target.value })}
                  className={inputClass}
                  autoComplete="off"
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Jar" htmlFor={uid + '-jar-' + index}>
                  <input
                    id={uid + '-jar-' + index}
                    value={row.jar}
                    onChange={(event) => updateIngredient(index, { jar: event.target.value })}
                    className={inputClass}
                    autoComplete="off"
                  />
                </Field>
                <Field label="Glass" htmlFor={uid + '-glass-' + index}>
                  <input
                    id={uid + '-glass-' + index}
                    value={row.glass}
                    onChange={(event) => updateIngredient(index, { glass: event.target.value })}
                    className={inputClass}
                    autoComplete="off"
                  />
                </Field>
              </div>
            </div>
          ))}

          <Button
            tone="wash"
            full
            onClick={() => setIngredients((rows) => [...rows, emptyIngredient()])}
          >
            <Plus size={18} aria-hidden="true" />
            Add ingredient
          </Button>
        </section>

        <div className="mt-2 flex flex-col gap-3">
          <Button type="submit" full>
            Save
          </Button>
          <Button tone="wash" full onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>

      {isNew ? null : (
        <div className="mt-8 flex flex-col items-center gap-3">
          {confirmingDelete ? (
            <>
              <p className="text-15 text-muted">
                Delete this drink for good? This cannot be undone.
              </p>
              <div className="flex w-full flex-col gap-2">
                <Button tone="accent" full onClick={onDelete}>
                  Yes, delete it
                </Button>
                <Button tone="quiet" full onClick={() => setConfirmingDelete(false)}>
                  Keep it
                </Button>
              </div>
            </>
          ) : (
            <Button tone="quiet" onClick={() => setConfirmingDelete(true)}>
              Delete drink
            </Button>
          )}
        </div>
      )}

      {group === PREPARATIONS ? (
        <p className="mt-8 text-13 text-muted">
          Drinks in {PREPARATIONS} are linked from any ingredient with the same name.
        </p>
      ) : null}
    </div>
  );
}
