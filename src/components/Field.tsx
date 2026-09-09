import type { ReactNode } from 'react';

/**
 * Every input in the app is the same sticker: 52px tall, 17px text, a 2px edge and a
 * hard offset shadow. In focus the border turns accent and becomes the ring itself.
 */
export const inputClass = 'field';

/** The id the hint under a field is given, so a caller can point at it. */
export function hintIdFor(htmlFor: string): string {
  return htmlFor + '-hint';
}

type Props = {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: boolean;
  children: ReactNode;
};

/** Labels sit above their input, always visible, never a placeholder standing in. */
export default function Field({ label, htmlFor, hint, error = false, children }: Props) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="font-display text-15 font-medium text-ink">
        {label}
      </label>
      {children}
      {hint ? (
        <p
          id={hintIdFor(htmlFor)}
          className={'text-13 ' + (error ? 'font-bold text-accent-deep' : 'text-muted')}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}
