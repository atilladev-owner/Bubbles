import { X } from 'lucide-react';

type Props = { onDismiss: () => void };

/**
 * Shown once, on a first visit in Safari on an iPhone with the app not yet installed.
 * When the detection cannot be sure, the hint stays hidden rather than nagging.
 */
export default function InstallHint({ onDismiss }: Props) {
  return (
    <div className="mt-4 flex items-start gap-3 rounded-md border border-line bg-panel p-4">
      <p className="text-15">
        Add Bubbles to your home screen: tap Share, then Add to Home Screen.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss the install hint"
        className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-sm text-muted press active:scale-[0.98] active:bg-wash"
      >
        <X size={20} aria-hidden="true" />
      </button>
    </div>
  );
}

/** True only when we are certain: an iPhone or iPad, in Safari, not yet installed. */
export function shouldOfferInstall(): boolean {
  if (typeof navigator === 'undefined' || typeof window === 'undefined') return false;

  const standalone = (navigator as Navigator & { standalone?: boolean }).standalone;
  if (standalone !== false) return false; // true means installed, undefined means not iOS Safari

  const ua = navigator.userAgent;
  const isIos = /iPhone|iPad|iPod/.test(ua);
  if (!isIos) return false;

  // Chrome, Firefox and Edge on iOS carry their own tokens and use a different share flow.
  const isOtherBrowser = /CriOS|FxiOS|EdgiOS|OPiOS/.test(ua);
  if (isOtherBrowser) return false;

  return /Safari/.test(ua);
}
