import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Download, Upload, X } from 'lucide-react';
import Button from './Button';

type Props = {
  open: boolean;
  lastBackupAt: string | null;
  notice: string | null;
  onClose: () => void;
  onBackup: () => void;
  onRestore: (file: File) => void;
};

function readableDate(iso: string | null): string {
  if (iso === null) return 'No backup yet.';
  const when = new Date(iso);
  if (Number.isNaN(when.getTime())) return 'No backup yet.';
  return 'Last backup on ' + when.toLocaleDateString() + '.';
}

export default function MoreSheet({
  open,
  lastBackupAt,
  notice,
  onClose,
  onBackup,
  onRestore,
}: Props) {
  const reduce = useReducedMotion();
  const filePicker = useRef<HTMLInputElement>(null);
  const firstControl = useRef<HTMLButtonElement>(null);
  const [confirmingRestore, setConfirmingRestore] = useState(false);

  useEffect(() => {
    if (!open) {
      setConfirmingRestore(false);
      return;
    }
    firstControl.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const duration = reduce ? 0 : 0.18;

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-30">
          <motion.button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute inset-0 h-full w-full bg-ink/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="More"
            className="absolute inset-x-0 bottom-0 rounded-t-lg bg-panel shadow-sheet"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration, ease: 'easeOut' }}
          >
            <div
              className="px-4 pt-5"
              style={{ paddingBottom: 'calc(1.75rem + env(safe-area-inset-bottom))' }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-24 text-ink">More</h2>
                <button
                  ref={firstControl}
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="quiet -mr-2 inline-flex h-11 w-11 items-center justify-center text-muted"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <Button tone="primary" full onClick={onBackup}>
                  <Download size={18} aria-hidden="true" />
                  Backup
                </Button>
                <p className="text-13 text-muted">{readableDate(lastBackupAt)}</p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                {confirmingRestore ? (
                  <>
                    <p className="text-15 text-muted">
                      Restoring replaces every drink on this phone. Back up first if you are
                      not sure.
                    </p>
                    <Button tone="primary" full onClick={() => filePicker.current?.click()}>
                      Yes, choose a file
                    </Button>
                    <Button tone="quiet" full onClick={() => setConfirmingRestore(false)}>
                      Keep what is here
                    </Button>
                  </>
                ) : (
                  <>
                    <Button tone="secondary" full onClick={() => setConfirmingRestore(true)}>
                      <Upload size={18} aria-hidden="true" />
                      Restore
                    </Button>
                    <p className="text-13 text-muted">
                      Reads a backup file and replaces every drink.
                    </p>
                  </>
                )}
                <input
                  ref={filePicker}
                  type="file"
                  accept="application/json,.json"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = '';
                    if (file) onRestore(file);
                  }}
                />
              </div>

              {notice === null ? null : (
                <p role="status" className="mt-4 text-15 font-bold text-accent">
                  {notice}
                </p>
              )}

              <div className="mt-6 border-t-2 border-wash pt-5">
                <p className="text-15 text-ink">
                  Add Bubbles to your home screen: tap Share, then Add to Home Screen.
                </p>
                <p className="mt-1 text-13 text-muted">
                  Once it is there, it opens with no signal.
                </p>
              </div>

              {/* The maker's mark, where a phone app can carry one: the foot of the sheet. */}
              <div className="mt-5 border-t border-line pt-1">
                <a
                  href="https://atilladev.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quiet inline-flex min-h-11 items-center gap-2 text-13 text-muted"
                >
                  <img
                    src="/atilla-crest-black.webp"
                    alt=""
                    width={400}
                    height={411}
                    className="h-5.5 w-auto shrink-0"
                  />
                  Product of Atilla Dev
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
