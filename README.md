# Bubbles

A bartender's pocket recipe book. Anyone can install it, and the book you keep lives on
your own phone. It works with no signal, halves a recipe in one tap, and keeps every drink
editable. Nothing is shared, nothing needs an account, and there is no server behind it.

It is built for a 390px phone screen held one handed behind a bar. Desktop works, but the
phone is the surface it was designed for.

## Features

- **Offline first.** Once it has been opened once, it launches and works with no signal.
  Every drink lives in the phone's own database, never on a server.
- **Installs to the home screen.** Add it from the Safari share sheet and it opens like an
  app, full screen, with its own icon.
- **One tap halving.** Every drink and every preparation opens on Full, with a Full and
  Half switch that halves the jar figures and the glass figures together. Figures that
  cannot be halved sensibly, a count or a length, are shown as written and marked, rather
  than quietly turned into nonsense.
- **Search as you type.** Matches the drink name and every ingredient name, across all
  groups at once.
- **Favourites first.** Favourites sit at the top of the list, above the groups.
- **Groups you choose.** The book opens with a set of groups and you can add your own.
  Preparations always sort last, and any ingredient whose name matches a preparation
  becomes a link straight to it. The shorthand "mak.g" is always written out as makgeolli,
  so a shortened ingredient still finds its preparation.
- **Everything is editable.** Name, group, note and the ingredient rows, with up and down
  controls for reordering, because drag and drop is unreliable on a wet phone.
- **Backup and restore.** A single JSON file you keep wherever you like.
- **No accounts, and nothing about the drinks ever leaves the phone.** The fonts and the
  icons are served from the app itself. Once installed on the home screen it makes no
  network calls at all. The hosted address, opened in a browser, counts a page view
  through Vercel Web Analytics and nothing more.

## Running it

Requires Node 22 or newer.

```sh
npm install
npm run dev
```

Then open the address the terminal prints. Other scripts:

```sh
npm test        # the halving rules and the backup reader
npm run typecheck
npm run build   # rasterises the icons, type checks, then builds to dist/
npm run preview # serves the built output
```

The build is fully static. Any static host will serve it, including Vercel's free tier
with no configuration.

## Backup and restore

Everything lives in the phone's IndexedDB, which means it is as durable as the browser's
site data and no more. Clearing site data or deleting the app can take the drinks with it,
so back up whenever you have made real changes.

**Backup.** Open More on the home screen and tap Backup. The phone downloads a file named
`bubbles-backup-YYYY-MM-DD.json` containing every drink. Keep it in your files, a note to
yourself, or anywhere else you trust. The sheet shows the date of the last backup, and the
home screen shows a quiet reminder under the list when there have been edits since then.

**Restore.** Open More, tap Restore, confirm, and pick a backup file. Restoring replaces
every drink on the phone with the contents of that file, so take a backup first if you are
not sure. A file that is not a Bubbles backup is refused, and every field in a file that is
accepted is checked before it is used.

The file is plain JSON and looks like this:

```json
{
  "app": "bubbles",
  "version": 1,
  "exportedAt": "2026-01-01T00:00:00.000Z",
  "drinks": []
}
```

## Example drinks

The repository ships with example drinks only: eight classic drinks and two preparations anyone could know,
loaded once when the database is empty and editable or deletable like anything else.

## Built with

Vite, React, TypeScript, Tailwind CSS v4, vite-plugin-pwa, idb-keyval, Motion,
lucide-react and Vitest. Fredoka and Nunito are self hosted under `public/fonts` and are
licensed under the SIL Open Font License.
