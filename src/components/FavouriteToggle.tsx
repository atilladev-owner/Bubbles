type Props = { on: boolean; onToggle: () => void };

/**
 * The favourite mark is a dot, one of the only two round things in the app.
 */
export default function FavouriteToggle({ on, onToggle }: Props) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onToggle}
      className={[
        'inline-flex min-h-11 shrink-0 items-center gap-2 rounded-sm px-3 press active:scale-[0.98]',
        on ? 'bg-wash text-accent' : 'bg-panel text-muted',
      ].join(' ')}
    >
      <span
        aria-hidden="true"
        className={[
          'circle h-3 w-3',
          on ? 'bg-accent' : 'border-2 border-line bg-panel',
        ].join(' ')}
      />
      <span className="text-13 font-bold">Favourite</span>
    </button>
  );
}
