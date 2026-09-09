type Props = { on: boolean; onToggle: () => void };

/**
 * The favourite state describes rather than acts, so it wears no sticker: a dot, one of
 * the only two round things in the app, and a word that says which way it sits, so the
 * state never rests on colour alone.
 */
export default function FavouriteToggle({ on, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={[
        'quiet inline-flex min-h-11 shrink-0 items-center gap-2 px-2',
        on ? 'text-accent-deep' : 'text-muted',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={'circle h-3.5 w-3.5 ' + (on ? 'bg-accent' : 'bg-muted')}
      />
      <span className="text-15 font-bold">{on ? 'Favourite' : 'Not a favourite'}</span>
    </button>
  );
}
