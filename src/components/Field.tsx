import type { ReactNode } from 'react';

/** Every input in the app wears the same border, radius and height. */
export const inputClass =
  'w-full min-h-11 rounded-md border border-line bg-panel px-3 py-2 text-17 ' +
  'text-ink placeholder:text-muted focus:border-accent';

type Props = { label: string; htmlFor: string; hint?: string; children: ReactNode };

/** Labels sit above their input, always visible, never a placeholder standing in. */
export default function Field({ label, htmlFor, hint, children }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={htmlFor} className="text-13 font-bold text-muted">
        {label}
      </label>
      {children}
      {hint ? <p className="text-13 text-muted">{hint}</p> : null}
    </div>
  );
}
