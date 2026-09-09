import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Tone = 'primary' | 'secondary' | 'quiet';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  full?: boolean;
  children: ReactNode;
};

/**
 * Three tiers and no more. Primary is a sticker filled with the accent, secondary is a
 * sticker on the panel, and quiet carries no sticker at all: a word in the muted tone
 * that goes to the deeper accent while it is held.
 */
const TONES: Record<Tone, string> = {
  primary: 'sticker sticker-accent press rounded-md',
  secondary: 'sticker press rounded-md text-accent-deep',
  quiet: 'quiet text-muted',
};

export default function Button({ tone = 'primary', full = false, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={[
        'inline-flex min-h-12 items-center justify-center gap-2 px-4 py-2',
        'text-17 font-bold disabled:opacity-50',
        TONES[tone],
        full ? 'w-full' : '',
        className ?? '',
      ].join(' ')}
    />
  );
}
