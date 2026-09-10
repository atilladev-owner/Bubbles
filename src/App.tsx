import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import Home, { Ground } from './screens/Home';
import DrinkView from './screens/DrinkView';
import EditForm from './screens/EditForm';
import MoreSheet from './components/MoreSheet';
import { shouldOfferInstall } from './components/InstallHint';
import { EXAMPLE_DRINKS } from './data/examples';
import { backupFilename, parseBackup, toBackup } from './lib/backup';
import { capitaliseDrink, emptyDrink, orderGroups, tidyDrinks } from './lib/drinks';
import {
  DEFAULT_GROUPS,
  EMPTY_META,
  loadDrinks,
  loadGroupOrder,
  loadMeta,
  saveDrinks,
  saveGroupOrder,
  saveMeta,
} from './lib/storage';
import type { Drink, Meta } from './types';

type Route =
  | { name: 'home' }
  | { name: 'drink'; id: string }
  | { name: 'edit'; id: string | null };

const HINT_KEY = 'bubbles.installHintDismissed';

export default function App() {
  const reduce = useReducedMotion();

  const [ready, setReady] = useState(false);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [groupOrder, setGroupOrder] = useState<string[]>(DEFAULT_GROUPS);
  const [meta, setMeta] = useState<Meta>(EMPTY_META);
  const [route, setRoute] = useState<Route>({ name: 'home' });
  const [draft, setDraft] = useState<Drink | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [installHint, setInstallHint] = useState(false);

  // Read the phone's database once at start, and seed the examples when it is empty.
  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [storedDrinks, storedGroups, storedMeta] = await Promise.all([
        loadDrinks(),
        loadGroupOrder(),
        loadMeta(),
      ]);
      if (cancelled) return;
      if (storedDrinks === undefined) {
        await saveDrinks(EXAMPLE_DRINKS);
        setDrinks(EXAMPLE_DRINKS);
      } else {
        // A book that reached the phone before the casing rules existed is brought up
        // to them once here, and written back only when that changed something.
        const tidied = tidyDrinks(storedDrinks);
        if (tidied.changed) await saveDrinks(tidied.drinks);
        if (cancelled) return;
        setDrinks(tidied.drinks);
      }
      setGroupOrder(storedGroups ?? DEFAULT_GROUPS);
      setMeta(storedMeta);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // The phone's back gesture walks the same stack the Back controls do.
  useEffect(() => {
    window.history.replaceState({ bubbles: { name: 'home' } }, '');
    const onPop = (event: PopStateEvent) => {
      const state = (event.state as { bubbles?: Route } | null)?.bubbles;
      setRoute(state ?? { name: 'home' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  useEffect(() => {
    try {
      if (localStorage.getItem(HINT_KEY) === '1') return;
    } catch {
      return;
    }
    setInstallHint(shouldOfferInstall());
  }, []);

  useEffect(() => {
    if (!moreOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [moreOpen]);

  const go = useCallback((next: Route) => {
    window.history.pushState({ bubbles: next }, '');
    setRoute(next);
  }, []);

  const replace = useCallback((next: Route) => {
    window.history.replaceState({ bubbles: next }, '');
    setRoute(next);
  }, []);

  const back = useCallback(() => window.history.back(), []);

  const persist = useCallback(
    async (nextDrinks: Drink[]) => {
      const order = orderGroups(nextDrinks, groupOrder);
      const nextMeta: Meta = { ...meta, changedAt: new Date().toISOString() };
      setDrinks(nextDrinks);
      setGroupOrder(order);
      setMeta(nextMeta);
      await Promise.all([saveDrinks(nextDrinks), saveGroupOrder(order), saveMeta(nextMeta)]);
    },
    [groupOrder, meta],
  );

  const isNew = route.name === 'edit' && route.id === null;
  const routeId = route.name === 'home' ? null : route.id;
  const active =
    route.name === 'home'
      ? undefined
      : isNew
        ? (draft ?? undefined)
        : drinks.find((drink) => drink.id === routeId);
  const overlayOpen = route.name !== 'home' && active !== undefined;

  function toggleFavourite(drink: Drink) {
    void persist(
      drinks.map((item) =>
        item.id === drink.id
          ? { ...item, favourite: !item.favourite, updatedAt: new Date().toISOString() }
          : item,
      ),
    );
  }

  function saveDrink(next: Drink) {
    const exists = drinks.some((item) => item.id === next.id);
    void persist(
      exists ? drinks.map((item) => (item.id === next.id ? next : item)) : [...drinks, next],
    );
    if (exists) {
      back();
    } else {
      setDraft(null);
      replace({ name: 'drink', id: next.id });
    }
  }

  function deleteDrink(id: string) {
    void persist(drinks.filter((item) => item.id !== id));
    replace({ name: 'home' });
  }

  async function runBackup() {
    const now = new Date();
    const blob = new Blob([JSON.stringify(toBackup(drinks, now), null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = backupFilename(now);
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    const nextMeta: Meta = { ...meta, lastBackupAt: now.toISOString() };
    setMeta(nextMeta);
    await saveMeta(nextMeta);
    setNotice('Backup saved.');
  }

  async function runRestore(file: File) {
    const restored = parseBackup(await file.text());
    if (restored === null) {
      setNotice('That file is not a Bubbles backup.');
      return;
    }
    // A file can hold anything she typed on another day, so every name in it is
    // brought up to the same rule the edit form applies.
    await persist(restored.map(capitaliseDrink));
    setNotice(null);
    setMoreOpen(false);
    replace({ name: 'home' });
  }

  const needsBackup =
    meta.changedAt !== null &&
    (meta.lastBackupAt === null || meta.changedAt > meta.lastBackupAt);

  if (!ready) return <div className="min-h-dvh bg-ground" />;

  return (
    <div className="fixed inset-0 overflow-hidden bg-ground">
      {/* The ground shapes sit under the list's scroller rather than inside it, so the
          phone's rubber band at either end of the list never moves them. */}
      {drinks.length === 0 ? null : <Ground />}
      {/* The list scrolls inside this container, never the document. Home steps out of
          reach while anything sits over it, so the Tab order and a screen reader stay
          inside the sheet or the page that is open. */}
      <div
        inert={overlayOpen || moreOpen}
        className="absolute inset-0 z-10 overflow-y-auto overscroll-y-contain"
      >
        <Home
          drinks={drinks}
          groupOrder={groupOrder}
          needsBackup={needsBackup}
          showInstallHint={installHint}
          onDismissInstallHint={() => {
            setInstallHint(false);
            try {
              localStorage.setItem(HINT_KEY, '1');
            } catch {
              // A phone with storage turned off simply sees the hint again next time.
            }
          }}
          onOpenDrink={(id) => go({ name: 'drink', id })}
          onAddDrink={() => {
            setDraft(emptyDrink(groupOrder[0] ?? DEFAULT_GROUPS[0] ?? 'Ritas'));
            go({ name: 'edit', id: null });
          }}
          onOpenMore={() => {
            setNotice(null);
            setMoreOpen(true);
          }}
        />

        {/* The maker's mark where a wide screen has room for it: the plate and the faint
            crest, as every Atilla Dev build carries them. The More sheet keeps the mark on
            a phone. It sits inside this wrapper so it steps out of reach with Home. */}
        <div className="atilla-watermark hidden md:block" aria-hidden="true" />
        <a
          href="https://atilladev.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
          className="sticker press fixed right-[18px] bottom-[18px] z-[16] hidden min-h-11 items-center gap-2 rounded-sm py-2 pr-3.5 pl-2 text-13 font-bold text-muted md:inline-flex"
        >
          <img
            src="/atilla-crest-black.webp"
            alt=""
            width={400}
            height={411}
            className="h-6 w-auto shrink-0"
          />
          Product of Atilla Dev
        </a>
      </div>

      <AnimatePresence>
        {overlayOpen && active ? (
          <motion.div
            key="overlay"
            className="fixed inset-0 z-20 overflow-y-auto bg-ground"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: reduce ? 0 : 0.18, ease: 'easeOut' }}
          >
            {route.name === 'drink' ? (
              <DrinkView
                drink={active}
                drinks={drinks}
                onBack={back}
                onEdit={() => go({ name: 'edit', id: active.id })}
                onToggleFavourite={() => toggleFavourite(active)}
                onOpenDrink={(id) => go({ name: 'drink', id })}
              />
            ) : (
              <EditForm
                key={active.id}
                drink={active}
                groups={groupOrder}
                isNew={isNew}
                onSave={saveDrink}
                onCancel={back}
                onDelete={() => deleteDrink(active.id)}
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <MoreSheet
        open={moreOpen}
        lastBackupAt={meta.lastBackupAt}
        notice={notice}
        onClose={() => setMoreOpen(false)}
        onBackup={() => void runBackup()}
        onRestore={(file) => void runRestore(file)}
      />
    </div>
  );
}
