# OPEX Transactions Builder — Figma plugin

A small local Figma plugin that generates the **Transactions** screen (from the
design prototype) as a real, editable Figma frame — sidebar, header, search
toolbar, and the transactions table with status chips — using the OPEX brand
palette.

> The assistant can't draw into a Figma file directly, so this plugin is the
> bridge: you run it once inside Figma and it builds the frame for you. Every
> layer it creates is fully editable (auto-layout, real text, real fills).

## How to run it (one-time setup, ~1 min)

You need the **Figma desktop app** — local/dev plugins don't run in the browser.

1. Keep this `figma-plugin/` folder somewhere on your machine.
2. In the Figma desktop app, open your **OpEx Design System** file (or any file).
3. Menu: **Plugins → Development → Import plugin from manifest…**
4. Select `figma-plugin/manifest.json` from this folder.
5. Run it: **Plugins → Development → OPEX Transactions Builder**.

It drops a `Transactions — OPEX` frame (1440×900) at the centre of your current
page, selects it, and zooms to it. Run it again for another copy.

## What it builds

- **Sidebar** — OPEX wordmark, Home / Transactions (active) nav items, and the
  nav group labels (Settlements, Payments, …).
- **Header** — "Transactions" title + subtitle.
- **Toolbar** — search field, "Show additional filters" toggle, Search button.
- **Table** — 7 columns (Transaction id, Date time, Amount, Scheme, Type,
  Product, Outcome) and the 8 sample rows, with green/red status chips and
  right-aligned, colour-coded amounts.

## Tweaking

- **Font:** uses **Inter** (always available). If your org has the Roobert
  brand font, change `const FONT_FAMILY = "Inter"` in `code.js` to the exact
  Figma family name (e.g. `"Roobert"`) and re-run.
- **Icons:** the sidebar/search/amount icons are small rounded squares as
  placeholders (a plugin can't embed the Phosphor icon font). Swap them for your
  real icon components after generating.
- **Colours** live in the `C` object at the top of `code.js` (OPEX palette).
- **Data** lives in the `ROWS` array — same values as the prototype's
  `data/mock.js`.
- Everything is **auto-layout**, so it reflows when you edit text or resize.

## Using your *real* library components instead

This version builds primitives (frames/text). If you'd prefer it to assemble
your existing components (real Button, Table Row, Nav Item, …), that's possible —
it needs each component's key, and the script can switch to
`figma.importComponentByKeyAsync(...)` + `.createInstance()`. Tell the assistant
which components to use (or share their keys) and it can wire it up.
