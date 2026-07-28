// OPEX Transactions Builder — Figma plugin
// Builds a faithful "Transactions" screen frame using the OPEX brand palette.
// Run from the Figma DESKTOP app:
//   Plugins → Development → Import plugin from manifest… (pick manifest.json)
//   Plugins → Development → OPEX Transactions Builder
//
// Everything is generated with Inter (always available in Figma). Change the
// FONT_FAMILY constant below to "Roobert" if that brand font is available.
//
// Note on sizing: Figma only allows layoutSizingHorizontal/Vertical to be set
// on a node AFTER it has been appended to an auto-layout parent, and the
// parent's sizing must be finalised first. This script therefore always
// appends a node, sizes it, and only then builds its children (top-down).

const FONT_FAMILY = "Inter";

// ---- OPEX brand palette (from the app theme / prototype) ------------------
const C = {
  primary: "#196254",
  primaryDark: "#003F33",
  success: "#228471",
  successTint: "#E4F1EC",
  error: "#A73A48",
  errorTint: "#FFEAE5",
  textPrimary: "#180F06",
  textSecondary: "#424242",
  border: "#E4E4E4",
  page: "#FAFAFA",
  surface: "#FFFFFF",
  navActiveTint: "#E7F0ED",
  iconMuted: "#C9C9C9",
};

// ---- Transactions data (mirrors design-prototype/data/mock.js) ------------
const ROWS = [
  { id: "tx_9f3a12c7b0e14d2f", date: "2026-07-27 14:32:05", amount: 4250, currency: "GBP", scheme: "Visa", type: "Sale", product: "Card Present", outcome: "Authorised" },
  { id: "tx_1b8e44a9c7d3f0aa", date: "2026-07-27 14:18:41", amount: -1200, currency: "GBP", scheme: "Mastercard", type: "Refund", product: "Card Present", outcome: "Authorised" },
  { id: "tx_77c0e2119a4b6d8e", date: "2026-07-27 13:59:12", amount: 899, currency: "GBP", scheme: "Visa", type: "Sale", product: "Online", outcome: "Declined" },
  { id: "tx_5da6f3b8271c9e40", date: "2026-07-27 13:41:33", amount: 15000, currency: "GBP", scheme: "Amex", type: "Sale", product: "Card Present", outcome: "Authorised" },
  { id: "tx_2e9b7c04a1f8d365", date: "2026-07-27 13:22:07", amount: 3299, currency: "EUR", scheme: "Mastercard", type: "Sale", product: "Online", outcome: "Authorised" },
  { id: "tx_a4c81de6039b7f22", date: "2026-07-27 12:58:50", amount: -500, currency: "GBP", scheme: "Visa", type: "Reversal", product: "Card Present", outcome: "Authorised" },
  { id: "tx_63f0b19d8c2a4e57", date: "2026-07-27 12:44:18", amount: 7499, currency: "GBP", scheme: "Visa", type: "Sale", product: "MOTO", outcome: "Declined" },
  { id: "tx_0c7e5a2f14b98d6a", date: "2026-07-27 12:30:02", amount: 2599, currency: "GBP", scheme: "Mastercard", type: "Sale", product: "Card Present", outcome: "Authorised" },
];

const COLUMNS = [
  { key: "id", label: "Transaction id", w: 250 },
  { key: "date", label: "Date time", w: 160 },
  { key: "amount", label: "Amount", w: 90, align: "RIGHT" },
  { key: "scheme", label: "Scheme", w: 110 },
  { key: "type", label: "Type", w: 100 },
  { key: "product", label: "Product", w: 130 },
  { key: "outcome", label: "Outcome", fill: true },
];

const NAV_GROUPS = [
  "Settlements", "Payments", "Transaction API", "Account Management",
  "Payment Operations", "Terminals", "Integrations", "Embedded Finance",
  "Tools", "Admin Fun",
];

// ---- low-level helpers ----------------------------------------------------
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}
const solid = (hex) => [{ type: "SOLID", color: hexToRgb(hex) }];

function money(minor, ccy) {
  const sym = { GBP: "£", EUR: "€", USD: "$" }[ccy] || "";
  const v = (Math.abs(minor) / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 });
  return (minor < 0 ? "-" : "") + sym + v;
}

function styleFor(weight) {
  // "Bold" is intentionally mapped to Medium per brand direction.
  if (weight === "bold") return "Medium";
  if (weight === "semibold") return "Semi Bold";
  if (weight === "medium") return "Medium";
  return "Regular";
}

function makeText(chars, opts = {}) {
  const t = figma.createText();
  t.fontName = { family: FONT_FAMILY, style: styleFor(opts.weight) };
  t.characters = String(chars);
  t.fontSize = opts.size || 14;
  t.fills = solid(opts.color || C.textPrimary);
  if (opts.align) t.textAlignHorizontal = opts.align;
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  return t;
}

// Create an auto-layout frame (not yet attached).
function box(opts = {}) {
  const f = figma.createFrame();
  f.layoutMode = opts.dir === "v" ? "VERTICAL" : "HORIZONTAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.counterAxisAlignItems = opts.cross || "CENTER";
  if (opts.main) f.primaryAxisAlignItems = opts.main;
  f.itemSpacing = opts.gap != null ? opts.gap : 0;
  const p = opts.pad || [0, 0, 0, 0]; // [top, right, bottom, left]
  f.paddingTop = p[0]; f.paddingRight = p[1]; f.paddingBottom = p[2]; f.paddingLeft = p[3];
  f.fills = opts.fill ? solid(opts.fill) : [];
  if (opts.radius != null) f.cornerRadius = opts.radius;
  if (opts.name) f.name = opts.name;
  return f;
}

// Bottom-only divider on an auto-layout row/frame.
function bottomBorder(node) {
  node.strokes = solid(C.border);
  node.strokeAlign = "INSIDE";
  node.strokeTopWeight = 0;
  node.strokeLeftWeight = 0;
  node.strokeRightWeight = 0;
  node.strokeBottomWeight = 1;
}

// Append `child` to `parent` (auto-layout) then apply sizing.
// opts: { w } fixed width, { fillW } fill width, { fillH } fill height.
function add(parent, child, opts = {}) {
  parent.appendChild(child);
  if (opts.w != null) { child.layoutSizingHorizontal = "FIXED"; child.resize(opts.w, child.height); }
  else if (opts.fillW) child.layoutSizingHorizontal = "FILL";
  if (opts.fillH) child.layoutSizingVertical = "FILL";
  return child;
}

// Fixed-size non-auto-layout square used as a lightweight icon placeholder.
function iconChip(hex, size) {
  const s = size || 18;
  const f = figma.createFrame();
  f.resize(s, s);
  f.cornerRadius = 4;
  f.fills = solid(hex);
  return f;
}

// ---- sidebar --------------------------------------------------------------
function buildNavItem(parent, label, active) {
  const row = add(parent, box({ pad: [10, 12, 10, 12], gap: 10, radius: 8, fill: active ? C.navActiveTint : undefined }), { fillW: true });
  row.appendChild(iconChip(active ? C.primary : C.iconMuted));
  row.appendChild(makeText(label, { size: 14, weight: active ? "semibold" : "regular", color: active ? C.primary : C.textSecondary }));
}

function buildSidebar(root) {
  const side = add(root, box({ dir: "v", gap: 4, pad: [16, 12, 16, 12], fill: C.surface, cross: "MIN", name: "Sidebar" }), { w: 248, fillH: true });
  side.strokes = solid(C.border);
  side.strokeAlign = "INSIDE";
  side.strokeTopWeight = 0; side.strokeBottomWeight = 0; side.strokeLeftWeight = 0; side.strokeRightWeight = 1;

  const brand = add(side, box({ pad: [4, 8, 12, 8], gap: 10 }), { fillW: true });
  brand.appendChild(iconChip(C.primary, 28));
  brand.appendChild(makeText("OPEX", { size: 18, weight: "bold", color: C.textPrimary }));

  buildNavItem(side, "Home", false);
  buildNavItem(side, "Transactions", true);

  const groups = add(side, box({ dir: "v", gap: 4, pad: [14, 12, 0, 12], cross: "MIN" }), { fillW: true });
  NAV_GROUPS.forEach((g) => groups.appendChild(makeText(g, { size: 13, weight: "medium", color: C.textSecondary })));
}

// ---- toolbar --------------------------------------------------------------
function buildToolbar(main) {
  const bar = add(main, box({ gap: 12, name: "Toolbar" }), { fillW: true });

  const search = add(bar, box({ pad: [10, 14, 10, 14], gap: 10, radius: 8, fill: C.surface }), { w: 380 });
  search.strokes = solid(C.border); search.strokeWeight = 1; search.strokeAlign = "INSIDE";
  search.appendChild(iconChip(C.iconMuted, 16));
  search.appendChild(makeText("Search by Merchant ID, Transaction ID or Terminal ID", { size: 13, color: C.textSecondary }));

  const toggleWrap = bar.appendChild(box({ gap: 8 }));
  toggleWrap.appendChild(makeText("Show additional filters", { size: 13, color: C.textSecondary }));
  const track = figma.createFrame();
  track.resize(36, 20); track.cornerRadius = 999; track.fills = solid(C.iconMuted);
  const knob = figma.createEllipse(); knob.resize(16, 16); knob.fills = solid(C.surface);
  track.appendChild(knob); knob.x = 2; knob.y = 2;
  toggleWrap.appendChild(track);

  add(bar, box({}), { fillW: true }); // spacer pushes the button to the right

  const btn = bar.appendChild(box({ pad: [10, 18, 10, 18], radius: 8, fill: C.primary }));
  btn.appendChild(makeText("Search", { size: 14, weight: "semibold", color: "#FFFFFF" }));
}

// ---- table ----------------------------------------------------------------
function chip(label) {
  const bad = label === "Declined";
  const c = box({ pad: [3, 10, 3, 10], radius: 999, fill: bad ? C.errorTint : C.successTint });
  c.appendChild(makeText(label, { size: 12, weight: "medium", color: bad ? C.error : C.success }));
  return c;
}

function addCell(row, node, col) {
  const c = add(row, box({ pad: [0, 12, 0, 0], main: col.align === "RIGHT" ? "MAX" : "MIN" }), col.fill ? { fillW: true } : { w: col.w });
  c.appendChild(node);
}

function buildHeaderRow(card) {
  const row = add(card, box({ pad: [12, 20, 12, 20], fill: C.page, name: "Header row" }), { fillW: true });
  bottomBorder(row);
  COLUMNS.forEach((col) => {
    addCell(row, makeText(col.label, { size: 12, weight: "semibold", color: C.textSecondary, align: col.align === "RIGHT" ? "RIGHT" : "LEFT" }), col);
  });
}

function buildDataRow(card, r, last) {
  const row = add(card, box({ pad: [14, 20, 14, 20], fill: C.surface }), { fillW: true });
  if (!last) bottomBorder(row);
  COLUMNS.forEach((col) => {
    let node;
    if (col.key === "outcome") node = chip(r.outcome);
    else if (col.key === "amount") node = makeText(money(r.amount, r.currency), { size: 14, weight: "medium", color: r.amount < 0 ? C.error : C.textPrimary, align: "RIGHT" });
    else node = makeText(r[col.key], { size: col.key === "id" ? 13 : 14, color: C.textPrimary });
    addCell(row, node, col);
  });
}

function buildTable(main) {
  const card = add(main, box({ dir: "v", radius: 12, fill: C.surface, cross: "MIN", name: "Transactions table" }), { fillW: true });
  card.strokes = solid(C.border); card.strokeWeight = 1; card.strokeAlign = "INSIDE";
  card.clipsContent = true;
  buildHeaderRow(card);
  ROWS.forEach((r, i) => buildDataRow(card, r, i === ROWS.length - 1));
}

// ---- main + assemble ------------------------------------------------------
function buildMain(root) {
  const main = add(root, box({ dir: "v", gap: 24, pad: [32, 32, 32, 32], fill: C.page, cross: "MIN", name: "Main" }), { fillW: true, fillH: true });

  const header = add(main, box({ dir: "v", gap: 4, cross: "MIN" }), { fillW: true });
  header.appendChild(makeText("Transactions", { size: 26, weight: "bold", color: C.textPrimary }));
  header.appendChild(makeText("Search transactions across all merchants and terminals", { size: 14, color: C.textSecondary }));

  buildToolbar(main);
  buildTable(main);
}

async function build() {
  await Promise.all([
    figma.loadFontAsync({ family: FONT_FAMILY, style: "Regular" }),
    figma.loadFontAsync({ family: FONT_FAMILY, style: "Medium" }),
    figma.loadFontAsync({ family: FONT_FAMILY, style: "Semi Bold" }),
    figma.loadFontAsync({ family: FONT_FAMILY, style: "Bold" }),
  ]);

  const root = box({ fill: C.page, cross: "MIN", name: "Transactions — OPEX" });
  root.primaryAxisSizingMode = "FIXED";
  root.counterAxisSizingMode = "FIXED";
  root.resize(1440, 900);
  figma.currentPage.appendChild(root);

  buildSidebar(root);
  buildMain(root);

  const vc = figma.viewport.center;
  root.x = Math.round(vc.x - 720);
  root.y = Math.round(vc.y - 450);

  figma.currentPage.selection = [root];
  figma.viewport.scrollAndZoomIntoView([root]);
  figma.closePlugin("Built the Transactions screen ✓");
}

build().catch((e) => figma.closePlugin("Error: " + e.message));
