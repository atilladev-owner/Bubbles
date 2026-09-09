# Bubbles design

A bartender's pocket recipe book for one person. It installs to an iPhone home screen,
works with no signal, halves a glass recipe in one tap, and keeps every drink editable.
Nothing is shared, nothing needs an account, and nothing costs anything to run.

## Reading

A personal utility used mid shift, one handed, often with wet fingers and no signal, by
someone who is not technical. It should be the one screen that makes a rough night a
little softer: cute, warm and calm, never busy. The register is a friendly tool, not a
consumer app selling itself. Mobile is the only surface that matters; desktop must not
break, but is not designed for.

## Stack

Vite, React 19, TypeScript strict, Tailwind v4 through the Vite plugin with tokens declared
in `@theme`, `vite-plugin-pwa` for the manifest and service worker, `idb-keyval` for the
phone's database, `motion` for transitions, `lucide-react` for icons, Vitest for the rules.
Static build, hosted on Vercel's free tier with zero configuration. No backend.

## Tokens

Light theme only. Every text and ground pair must hold 4.5:1; the builder writes the
computed ratios in the report.

| Token | Value | Use |
|---|---|---|
| `--ground` | `#FFF7F9` | page background, a paper with a breath of pink |
| `--panel` | `#FFFFFF` | cards, sheets, inputs |
| `--wash` | `#FCE8EF` | tint behind a selected control, favourite marks |
| `--line` | `#F1D9E2` | hairlines, input borders |
| `--ink` | `#2E1F2B` | text |
| `--muted` | `#7A6273` | secondary text, labels |
| `--accent` | `#C93A6B` | the one accent: primary action, active switch, links |
| `--accent-deep` | `#A62C57` | pressed and focused accent |
| `--bubble` | `#F6C6D6` | decorative bubbles, pour bars and sticker shadows, never text |
| `--edge` | `#C97A99` | the 2px sticker border on every row, field and button; holds 3:1 on `--panel` because it is the shape's only edge |

Shadows are tinted toward the accent, never grey or black: `0 10px 30px rgba(201, 58,
107, 0.10)` on sheets, `0 1px 0 rgba(201, 58, 107, 0.06)` under list rows. Nothing else
casts a shadow.

## Type

Fredoka for the wordmark, headings and the big measurement numbers, weights 500 and 600.
Nunito for everything else, 400 and 700, line height 1.5. Loaded with `@font-face` from
self hosted files under `public/fonts/` with `font-display: swap`, never a Google Fonts link
in the built page. Scale in px: 13, 15, 17, 20, 24, 30, 38. Body is 17 on the phone,
because it is read at arm's length in a dim bar. Measurements in the recipe render at 24
in Fredoka with `font-variant-numeric: tabular-nums`.

## Shape and material: the sticker language

The first build used white cards with hairline borders and plain bordered inputs, and it
read as a default component library. That is not the product. Bubbles has one material,
the sticker: a soft flat shape with a firm edge and a hard offset shadow, the way a
puffy sticker sits on a notebook. It is cute, tactile, and it belongs to nobody's
template.

- **The sticker.** A surface on `--panel` with a 2px border in `--edge` (`#C97A99`) and a
  hard shadow of `3px 3px 0 var(--bubble)`, no blur. Radius scale: 10 on small controls,
  16 on rows, inputs and buttons, 22 on sheets. That is the whole scale, and nothing that
  holds text is a capsule. Every row, every field, every button and the search box is a
  sticker. Nothing else has a border or a shadow.
- **The press.** A sticker pressed moves onto its shadow: `translate(2px, 2px)` and the
  shadow shrinks to `1px 1px 0`, 120ms ease-out, on `:active`. Buttons, rows and the
  switch all press. It is the one motion the user sees on every tap, so it is short.
- **Focus.** A field in focus keeps its shadow and turns its border `--accent`, 2px, no
  outline ring, since the border is the ring. Keyboard focus on anything else is the 2px
  `--accent-deep` outline as before.
- **Buttons.** Primary is a sticker filled `--accent` with white text and a `--accent-deep`
  shadow. Secondary is a sticker on `--panel` with `--accent-deep` text. Quiet controls,
  such as the back link and the ingredient row tools, have no sticker: text or an icon in
  `--muted`, pressing to `--accent-deep`.
- **Fields.** A sticker with 17px text, 52px tall, label above in Fredoka 15 weight 500
  in `--ink`, never a placeholder as the label. The Group select is the same sticker with
  a chevron icon on the right and the native picker underneath. The note field keeps its
  fixed height and inner scroll.
- **Descriptive marks are never boxed.** The glass mark, the favourite state, the "as
  written" note and the ingredient count are plain text or an icon in `--muted` or a dot.
  The favourite dot is `--accent` when on and `--muted` when off, and the label reads
  "Favourite" or "Not a favourite" so the state never rests on colour alone.
  Chips, tags and badges are pills whatever their radius, and they do not exist here.

## Tables and numbers: the pour bars

The recipe table is the reason the app exists, so it carries the one piece of visual
information a plain table cannot. Under every gram figure sits a pour bar: a 6px bar in
`--bubble` whose width is that figure's share of the largest gram figure in the same
column, so the ratios of a recipe are visible at a glance and a bartender can see that
the soda is three times the syrup without reading. The bar under the column the switch has
selected is `--accent`. Values that are not grams, and blanks, have no bar. Measurements
render in Fredoka 28, weight 500, tabular. Ingredient names are Nunito 17. Rows are
separated by a 2px `--wash` rule rather than a hairline. The table header is Fredoka 15 in
`--muted`.

## Home rhythm

Group headings are Fredoka 24 weight 600 in `--ink`, each with a small three bubble mark to
its left in `--bubble` and `--wash`, and generous space above so the list breathes in
sections rather than running as one column. Rows are stickers with the name in Fredoka 22
and the ingredient count under it; the glass mark sits right in `--muted`. Rows enter once,
on first render, rising 8px with a 30ms stagger, and never again. The wordmark is Fredoka
44 over a bigger bubble cluster, 120px, that overlaps the top edge of the screen.

## The bubbles

The identity is a small cluster of soft circles in `--bubble` and `--wash`, three to five
of them, sitting behind the wordmark on the home screen and used at 512, 192 and 180px as
the app icon. They are drawn once as an inline SVG and rasterised to the icon sizes at build
time by a script under `scripts/`. They never carry text, never animate in a loop, and
appear nowhere else.

## Screens

Three screens and one sheet. Every screen fits a 390px wide phone with no sideways scroll,
respects the iPhone safe areas through `env(safe-area-inset-*)`, and keeps every tap target
at 44px or more.

### Home

The wordmark with the bubbles behind it, a search field, then the list. Favourites come
first under a "Favourites" heading, then every group in the order Ritas, Slushes,
Makgeolli, Ades, Soju, Highballs, and any group the user added, and Preparations last.
Each row is the drink name in Fredoka 20 and, in `--muted`, the count of ingredients; a
row with a glass figure carries a small "glass" mark so she knows it can be halved. Typing
in the search filters rows as she types, across every group, matching the drink name and
any ingredient name. "Add" is a primary sticker button in the header beside "More";
nothing floats over the list, and the list ends in plain space above the safe area.
Empty state, when the list is empty: the bubbles, one sentence saying there are no drinks
yet, and the Add button.

### Drink

Back control top left, the drink name as the `h1`, the group under it in `--muted`, a
favourite toggle top right. Then, only when at least one ingredient has a glass figure, a
two option switch: "Glass" and "Half glass". Then the recipe as a table with three columns,
ingredient, jar, glass; the glass column is omitted entirely on a drink with no glass
figures. The glass column shows the halved figures when Half glass is selected, and any
value that could not be halved shows as written with a small "as written" note under it.
The note, if the drink has one, sits under the table in `--muted`. An ingredient whose name
matches a preparation exactly, case insensitive, is a link to that preparation. An "Edit"
button at the bottom opens the edit form on the same route.

### Edit

The same page, now a form: name, group (a select from the existing groups plus "New
group", which reveals a text field), favourite toggle, note, and the ingredient list.
Each ingredient row has name, jar and glass fields and a remove control; "Add ingredient"
appends an empty row; rows can be reordered with up and down controls, since drag and drop
is unreliable on a wet phone. Save and Cancel at the bottom, Save is the accent button.
Delete drink sits under them in `--muted`, and asks once in an inline confirm. Every field
keeps whatever text she types; there is no validation beyond a non empty name. The Add
drink button on Home opens this same form empty.

### More sheet

Opened from a small control on Home. Three things: Backup, which downloads
`bubbles-backup-YYYY-MM-DD.json`; Restore, which opens the file picker and replaces every
drink after an inline confirm; and the install hint. Backup shows the date of the last
backup under it, and Home shows a quiet one line reminder under the list when there have
been edits since the last backup.

### Install hint

Shown once, on the first visit in Safari on iOS when the app is not yet installed:
"Add Bubbles to your home screen: tap Share, then Add to Home Screen." Two lines, a
dismiss control, and it never shows again once dismissed. Detected through
`navigator.standalone` and the user agent; when detection is unsure, it stays hidden.

## Data

```ts
type Ingredient = { name: string; jar: string; glass: string };
type Drink = {
  id: string;            // generated, never shown
  name: string;
  group: string;
  favourite: boolean;
  note: string;
  ingredients: Ingredient[];
  updatedAt: string;     // ISO
};
type Backup = { app: "bubbles"; version: 1; exportedAt: string; drinks: Drink[] };
```

Stored in IndexedDB through `idb-keyval` under one key, the whole list, written on every
save. Group order is stored under a second key. Read once at start into React state, and
every mutation writes through. A preparation is a drink whose group is `Preparations`.

The repository ships with an example set in `src/data/examples.ts`: six drinks and two
preparations, all classic bar recipes anyone could know, with realistic gram measurements,
two of them carrying glass figures so the halving switch shows. Names, measurements and
groups in the examples are not from any real establishment. The example set loads only
when the database is empty.

## Halving rules

Implemented in `src/lib/measure.ts` and covered by Vitest before the UI uses it.

- Only glass figures are ever halved. Jar figures are never transformed.
- A figure is halvable when it starts with a number and the unit after it, if any, is one
  that divides: none at all, `g`, `kg`, `mg`, `ml`, `cl`, `dl`, `l`, `oz`, `bottle`,
  `bottles`, `shot`, `shots`, `cup`, `cups`, `tsp`, `tbsp`. The number is halved, rounded
  to the nearest 0.5, and rendered without trailing zeros with the rest of the text kept:
  `83g` gives `41.5g`, `100g` gives `50g`, `1 bottle` gives `0.5 bottle`.
- Anything else is returned unchanged and flagged `asWritten: true` so the screen can
  mark it: a blank, `1ea`, `10cm`, `2ea (10cm)`, `1/2ea`, `4 slices`, `1 wedge`, a word.
  Counts and lengths are never split, because half a lemon slice is not a thing she pours.
- The function is pure: `halve(value: string): { value: string; asWritten: boolean }`.

Tests cover every example above, the empty string, whitespace padding, a decimal that
halves to a quarter (`1.5` gives `0.75`, which rounds to `1` under the nearest 0.5 rule and
the test says so), and a very large number.

## Offline and install

`vite-plugin-pwa` in `autoUpdate` mode precaches the built app and the fonts, so a
launch with no signal works after the first visit. The manifest names the app Bubbles,
sets `display: standalone`, the theme colour to `--ground`, and ships the three icon sizes.
An `apple-touch-icon` link and `apple-mobile-web-app-capable` meta are in `index.html`,
since iOS ignores the manifest for both.

## Motion

Only `transform` and `opacity`, 180ms `ease-out`: the drink page slides in from the
right over the list and back out, the switch's active state moves as a sliding indicator,
the More sheet rises from the bottom, and buttons press down. Nothing loops. All of it
collapses to instant under `prefers-reduced-motion`.

## Quality gates

Every screen's content sits in a `main` landmark, and the Home content is `inert` while
any sheet or overlay is open, so focus and assistive technology stay inside it. Field
errors are linked to their field with `aria-describedby` and `aria-invalid`, and focus
moves to the first invalid field on save. Every tap target, links inside the table
included, is 44px tall. Fredoka must actually render at 500 and 600: the shipped files
keep the weight axis or ship as separate static faces, and the report proves it by
measuring rendered widths at two weights.

One `h1` per screen, visible focus rings, labels above inputs, no sideways scroll at 390px,
AA contrast written down for every pair, no pills, no emoji, no dashes as punctuation in any
string, and Lighthouse's installability check passing on the built app.
