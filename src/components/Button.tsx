import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Tone = 'accent' | 'wash' | 'quiet';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone;
  full?: boolean;
  children: ReactNode;
};

const TONES: Record<Tone, string> = {
  accent: 'bg-accent text-white active:bg-accent-deep',
  wash: 'bg-wash text-accent active:bg-line',
  quiet: 'bg-transparent text-muted active:bg-wash',
};

/**
 * Every button in the app. Two solid pairs, both checked for contrast, and a quiet
 * third for the things that should not shout. The press is a 2 percent scale down.
 */
export default function Button({ tone = 'accent', full = false, className, ...rest }: Props) {
  return (
    <button
      type="button"
      {...rest}
      className={[
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-4 py-2',
        'text-17 font-bold press active:scale-[0.98] disabled:opacity-50',
        TONES[tone],
        full ? 'w-full' : '',
        className ?? '',
      ].join(' ')}
    />
  );
}
