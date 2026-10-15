# OPEX Admin — Design Prototype

A **lightweight, standalone clone** of the Payments Products Admin (OPEX) UI, built for
design review. It reproduces the real app's look & feel without any of the backend
setup (no GCP auth, no MongoDB, no Auth0). Everything here is static HTML/CSS/JS with
fake data.

## Why this exists

The production app is a Blazor Server app wired to live services, so running it locally
is an engineering task. This prototype lets a designer click through the same shell,
navigation, colours, typography and component patterns, tweak them freely, and share
concrete ideas with the developers.

## What's faithful to production

- **Brand assets** — the real `logo.svg` and Dojo Roobert fonts (copied from `wwwroot`).
- **Palette** — pulled from `BaseLayout.razor` (`#196254` primary, `#003F33` secondary,
  `#228471` success) and `StyleConstants.cs` (`#A73A48` "bad" colour).
- **Typography scale** — mirrors the MudBlazor theme (`H3`, `H5`, `Subtitle1`, `Body2`…).
- **Navigation** — the full drawer from `NavigationLinks.cs`: Home + Transactions on the
  top shelf, then the 10 grouped sections (Settlements, Payments, Transaction API,
  Account Management, Payment Operations, Terminals, Integrations, Embedded Finance,
  Tools, Admin Fun) with matching Phosphor icons. The drawer uses the Dojo design
  system's dark navigation colours and 20px icons. Group headers expand same-sized
  links inside the drawer, with only the current page selected and no secondary panel.
  The drawer stays full-width while its navigation links scroll between the dividers.
- **Component patterns** — cursor-paged tables, filter toolbars, chips, copy-to-clipboard
  cells, detail grids — matching pages like `TransactionsTable.razor` and `Users.razor`.

## Pages

**Every navigation item is now fully built** — no placeholders left. Pages are grouped
by the same sections as the real nav:

- **Core** — Home, Transactions (search + table), Transaction details
- **Settlements** — Daily Payouts (summary + list), All Payouts, All Payout Instructions,
  All Adjustments, All Settlements, All Profiles
- **Payments** — Payment Intents, Setup Intents, Pay By Bank
- **Transaction API** — Transaction V1 (dojo for business), Transaction V3 (sidekick),
  V3 details
- **Account Management** — Customers, Locations, Partners, Provisioning Queue
  (with stat cards), Online Checkout Activation
- **Payment Operations** — ALM (tabbed: Accounts, Transfers, Transfer Requests,
  Statements, Rules, Audit Logs)
- **Terminals** — Connect Terminals, Request RKI Unbind (form), Terminals config,
  Demo Terminal (form)
- **Integrations** — Capabilities, Zonal (form), Comtrex (form), Donations, Keyloop
- **Embedded Finance** — Manage YouLend Integration
- **Tools** — Refund Settings, Fees Import (upload), Dcc Settings, Reports (form)
- **Admin Fun** — Users, Roles and Permissions (permission matrix), Feedback

Table columns and form fields were taken from the real `.razor` pages so the layouts are
faithful; all row data is fake.

Home's **Share feedback** button opens a two-step feedback pop-up; the drawer's
Feedback button opens it too. A rating, at least one follow-up selection, and a
written response are required before submission. Submitting shows a thank-you
message. This is a design-only interaction: answers are not sent or stored.

## How to run

It's just static files. Easiest is a tiny local web server (needed because it uses ES
modules):

```bash
cd design-prototype
python3 -m http.server 8080
# then open http://localhost:8080
```

Or use any static server you like (`npx serve`, VS Code Live Server, etc.).

## Where to make design changes

- **Colours / spacing / typography** → `css/app.css` (top `:root` block holds the tokens)
- **Navigation structure** → `js/nav.js`
- **Page layouts** → `js/pages.js` (one function per route)
- **Reusable components** (tables, chips, tabs, forms, cards) → `js/components.js`
- **Sample data** → `data/mock.js`
