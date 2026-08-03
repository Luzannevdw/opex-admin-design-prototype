// Reusable UI building blocks shared across all prototype pages.
// These mirror the MudBlazor component patterns used in the real app.

export const money = (minor, ccy = "GBP") => {
  const sym = { GBP: "£", EUR: "€", USD: "$" }[ccy] || "";
  const v = (Math.abs(minor) / 100).toLocaleString("en-GB", { minimumFractionDigits: 2 });
  return `${minor < 0 ? "-" : ""}${sym}${v}`;
};

export const chip = (text, variant = "default") =>
  `<span class="chip ${variant}">${text}</span>`;

// Map common status strings to chip variants.
export const statusChip = (s) => {
  const ok = ["Paid", "Authorised", "Active", "Completed", "Approved", "Success", "Succeeded", "On", "Matched", "Bound", "Enabled", "Done"];
  const bad = ["Failed", "Declined", "Error", "Rejected", "Cancelled", "Unmatched", "Off", "Disabled", "Expired"];
  const warn = ["Pending", "In Progress", "Processing", "Queued", "Held", "Requires Action", "Awaiting", "Manual", "Review"];
  if (ok.includes(s)) return chip(s, "success");
  if (bad.includes(s)) return chip(s, "error");
  if (warn.includes(s)) return chip(s, "warning");
  return chip(s, "neutral");
};

export const copyCell = (val) =>
  `<span class="copy-cell"><span class="mono">${val}</span>` +
  `<button class="copy-btn" data-copy="${val}" title="Copy" aria-label="Copy">${icon("content_copy")}</button></span>`;

// Wire copy buttons: copy to clipboard + inline check/"Copied" feedback.
export function bindCopyButtons(root = document) {
  root.querySelectorAll(".copy-btn[data-copy]").forEach((btn) => {
    if (btn._bound) return;
    btn._bound = true;
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
      navigator.clipboard?.writeText(btn.dataset.copy).catch(() => {});
      const i = btn.querySelector("i");
      btn.classList.add("copied");
      if (i) { i.classList.remove("ph-copy"); i.classList.add("ph-check"); }
      clearTimeout(btn._t);
      btn._t = setTimeout(() => {
        btn.classList.remove("copied");
        if (i) { i.classList.remove("ph-check"); i.classList.add("ph-copy"); }
      }, 1300);
    });
  });
}

export const pageHeader = (title, subtitle) => `
  <div class="page-header">
    <div class="page-title">${title}</div>
    ${subtitle ? `<div class="caption">${subtitle}</div>` : ""}
  </div>`;

// ---- Icons: Phosphor (https://phosphoricons.com) ------------------------
// Icons are named with the original Material Symbol keys throughout the app;
// this map translates each to its closest Phosphor equivalent. `icon()` looks
// the name up here and renders a Phosphor <i> element. Unknown names are
// assumed to already be Phosphor kebab-case names and pass through unchanged.
export const PHOSPHOR_MAP = {
  home: "house",
  payments: "credit-card",
  balance: "scales",
  today: "calendar-dots",
  integration_instructions: "plugs-connected",
  currency_exchange: "currency-dollar",
  recent_actors: "address-book",
  layers: "stack",
  local_atm: "money",
  credit_card: "credit-card",
  add_card: "cards",
  transfer_within_a_station: "bank",
  developer_mode: "code",
  attach_money: "currency-dollar",
  money_off: "coins",
  join_right: "intersect",
  app_settings_alt: "sliders",
  location_city: "buildings",
  location_on: "map-pin",
  person: "user",
  plus_one: "plus-circle",
  shield: "shield-check",
  account_balance: "bank",
  payment: "credit-card",
  point_of_sale: "cash-register",
  autorenew: "arrows-clockwise",
  phonelink_setup: "device-mobile",
  call_to_action: "cursor-click",
  add: "plus",
  volunteer_activism: "hand-heart",
  all_inclusive: "infinity",
  account_balance_wallet: "wallet",
  science: "flask",
  assignment_return: "arrow-arc-left",
  settings: "gear",
  report: "file-text",
  admin_panel_settings: "shield-star",
  people: "users",
  lock: "lock",
  feedback: "chat-circle-dots",
  expand_more: "caret-down",
  search: "magnifying-glass",
  chevron_left: "caret-left",
  chevron_right: "caret-right",
  content_copy: "copy",
  arrow_back: "arrow-left",
  bolt: "lightning",
  build: "wrench",
  close: "x",
  cloud_upload: "cloud-arrow-up",
  download: "download-simple",
  upload: "upload-simple",
  edit: "pencil-simple",
  event_upcoming: "calendar-check",
  history: "clock-counter-clockwise",
  link_off: "link-break",
  more_vert: "dots-three-vertical",
  pending_actions: "hourglass-medium",
  refresh: "arrows-clockwise",
  remove: "minus",
  rule: "list-checks",
  send: "paper-plane-tilt",
  swap_horiz: "arrows-left-right",
  description: "file-text",
  done_all: "checks",
  draw: "pencil-simple-line",
  receipt_long: "receipt",
  lock_open: "lock-open",
  logout: "sign-out",
};

export const icon = (name, cls = "", attrs = {}) => {
  const ph = PHOSPHOR_MAP[name] || name;
  const a = Object.entries(attrs)
    .map(([k, v]) => ` ${k}="${v}"`)
    .join("");
  return `<i class="ph ph-${ph}${cls ? " " + cls : ""}"${a}></i>`;
};

// ---- Data table ---------------------------------------------------------
// columns: [{ label, render(row) }]  rows: array  rowNav: hash to navigate on row click
export function dataTable({ columns, rows, rowNav, striped = false, emptyText = "No records found." }) {
  const head = columns.map((c) => `<th>${c.label}</th>`).join("");
  const body = rows.length
    ? rows
        .map(
          (r) =>
            `<tr class="${rowNav ? "clickable" : ""}" ${rowNav ? `data-nav="${rowNav}"` : ""}>` +
            columns.map((c) => `<td>${c.render(r)}</td>`).join("") +
            `</tr>`
        )
        .join("")
    : `<tr><td colspan="${columns.length}"><div class="empty warn">${emptyText}</div></td></tr>`;
  return `
    <div class="table-wrap">
      <table class="tbl ${striped ? "striped" : ""}">
        <thead><tr>${head}</tr></thead>
        <tbody>${body}</tbody>
      </table>
      ${pager(rows.length)}
    </div>`;
}

export function pager(total) {
  return `
    <div class="pager">
      <span>Rows per page:</span>
      <select class="select"><option>10</option><option>25</option><option>50</option></select>
      <span>1–${total} of ${total}</span>
      <button class="icon-btn">${icon("chevron_left")}</button>
      <button class="icon-btn">${icon("chevron_right")}</button>
    </div>`;
}

// ---- Search / filter toolbar -------------------------------------------
const btnRow = (actions) =>
  actions
    .map((a) => `<button class="btn ${a.variant || "btn-outlined"}">${a.icon ? icon(a.icon) : ""} ${a.text}</button>`)
    .join("");

// Two-month range calendar (static, prototype-only) with brand-green range highlight.
function calendarMonth(year, month, start, end) {
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const dow = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const head = dow.map((d) => `<span class="cal-dow">${d}</span>`).join("");
  let cells = "";
  for (let i = 0; i < first; i++) cells += `<span class="cal-cell empty"></span>`;
  for (let d = 1; d <= days; d++) {
    const t = new Date(year, month, d).getTime();
    const cls = ["cal-cell"];
    if (start && end && t >= start && t <= end) cls.push("in-range");
    if (start && t === start) cls.push("range-start");
    if (end && t === end) cls.push("range-end");
    cells += `<span class="${cls.join(" ")}"><i>${d}</i></span>`;
  }
  return `
    <div class="cal-month">
      <div class="cal-title">${monthNames[month]} ${year}</div>
      <div class="cal-grid cal-head">${head}</div>
      <div class="cal-grid">${cells}</div>
    </div>`;
}

function dateRangePicker(c) {
  c = c || { year: 2026, month: 6, start: [2026, 6, 8], end: [2026, 7, 2] };
  const startMs = new Date(c.start[0], c.start[1], c.start[2]).getTime();
  const endMs = new Date(c.end[0], c.end[1], c.end[2]).getTime();
  const fmt = (a) => `${a[0]}-${String(a[1] + 1).padStart(2, "0")}-${String(a[2]).padStart(2, "0")}`;
  const m2 = c.month === 11 ? 0 : c.month + 1;
  const y2 = c.month === 11 ? c.year + 1 : c.year;
  return `
    <div class="daterange">
      <div class="dr-summary">
        ${icon("calendar-blank")}
        <span class="dr-val">${fmt(c.start)}</span>
        <span class="dr-arrow">${icon("arrow-right")}</span>
        <span class="dr-val">${fmt(c.end)}</span>
      </div>
      <div class="cal-popover">
        <button class="cal-nav prev" type="button">${icon("caret-left")}</button>
        <button class="cal-nav next" type="button">${icon("caret-right")}</button>
        <div class="cal-months">
          ${calendarMonth(c.year, c.month, startMs, endMs)}
          ${calendarMonth(y2, m2, startMs, endMs)}
        </div>
      </div>
    </div>`;
}

// Right-side "smart filters" drawer (pure CSS: checkbox toggle + :has state).
function filtersDrawer(f) {
  const chip = (name, val, txt, checked) =>
    `<label class="pill"><input type="checkbox" name="${name}" value="${val}"${checked ? " checked" : ""} /><span>${txt}</span></label>`;

  // Active filter summary chips (derived from defaults)
  const active = [];
  if (f.date && f.date.active && f.date.active !== "Custom") active.push(f.date.active);
  (f.pills || []).forEach((g) => (g.selected || []).forEach((s) => active.push(s)));
  if (f.segmented && f.segmented.active) active.push(f.segmented.active);
  const activeBar = active.length
    ? `<div class="fd-active">${active
        .map((a) => `<span class="active-chip">${a}${icon("x")}</span>`)
        .join("")}<button class="fd-clear">Clear all</button></div>`
    : "";

  // When — date preset chips (radios); Custom reveals a range calendar
  let dateBlock = "";
  if (f.date) {
    const presets = f.date.options
      .map(
        (o) =>
          `<label class="pill"><input type="radio" name="date-preset" value="${o}"${o === f.date.active ? " checked" : ""} /><span>${o}</span></label>`
      )
      .join("");
    dateBlock = `
      <div class="fd-block">
        <div class="fd-label">When</div>
        <div class="pill-row date-presets">${presets}</div>
        <div class="date-custom">${dateRangePicker(f.date.custom)}</div>
      </div>`;
  }

  const pillBlocks = (f.pills || [])
    .map((g) => {
      const chips = g.options
        .map((o) => chip(g.label, o, o, (g.selected || []).includes(o)))
        .join("");
      return `
        <div class="fd-block">
          <div class="fd-label">${g.label}</div>
          <div class="pill-row">${chips}</div>
        </div>`;
    })
    .join("");

  let segBlock = "";
  if (f.segmented) {
    const segs = f.segmented.options
      .map(
        (o) =>
          `<label class="seg"><input type="radio" name="segmented" value="${o}"${o === f.segmented.active ? " checked" : ""} /><span>${o}</span></label>`
      )
      .join("");
    segBlock = `
      <div class="fd-block">
        <div class="fd-label">${f.segmented.label}</div>
        <div class="segmented">${segs}</div>
      </div>`;
  }

  let rangeBlock = "";
  if (f.range) {
    const r = f.range;
    const pct = (v) => ((v - r.min) / (r.max - r.min)) * 100;
    rangeBlock = `
      <div class="fd-block">
        <div class="fd-label">${r.label}</div>
        <div class="range">
          <div class="range-track"><div class="range-fill" style="left:${pct(r.from)}%;right:${100 - pct(r.to)}%"></div></div>
          <input type="range" class="range-input" min="${r.min}" max="${r.max}" value="${r.from}" />
          <input type="range" class="range-input" min="${r.min}" max="${r.max}" value="${r.to}" />
        </div>
        <div class="range-vals"><span>${r.prefix || ""}${r.from.toLocaleString()}</span><span>${r.prefix || ""}${r.to.toLocaleString()}</span></div>
      </div>`;
  }

  let textBlock = "";
  if (f.text) {
    textBlock = `
      <div class="fd-block">
        <div class="fd-label">${f.text.label}</div>
        <input class="fd-text" placeholder="${f.text.placeholder || f.text.label}" />
      </div>`;
  }

  const toggles = (f.toggles || [])
    .map((t) => `<label class="switch"><input type="checkbox" role="switch" /> ${t}</label>`)
    .join("");
  const togglesBlock = toggles
    ? `<div class="fd-block"><div class="fd-toggles">${toggles}</div></div>`
    : "";

  const count = active.length;
  const resultCount = f.resultCount != null ? f.resultCount : "";
  return `
    <input type="checkbox" id="filters-open" class="filters-toggle" hidden />
    <label class="filters-backdrop" for="filters-open"></label>
    <aside class="filters-drawer" role="dialog" aria-label="Filters">
      <div class="fd-header">
        <div class="fd-title">Filters ${count ? `<span class="count-badge">${count}</span>` : ""}</div>
        <label class="fd-close" for="filters-open" title="Close">${icon("x")}</label>
      </div>
      ${activeBar}
      <div class="fd-body">
        ${dateBlock}
        ${pillBlocks}
        ${segBlock}
        ${rangeBlock}
        ${textBlock}
        ${togglesBlock}
      </div>
      <div class="fd-footer">
        <button class="btn btn-text">Reset all</button>
        <label class="btn btn-filled" for="filters-open">Show ${resultCount !== "" ? resultCount + " " : ""}results</label>
      </div>
    </aside>`;
}

export function searchToolbar({ placeholder = "Search", showFilters = false, required = false, filters = null, actions = [] }) {
  const hasPanel = filters && (filters.pills || filters.date || filters.segmented || filters.fields);
  let count = 0;
  if (hasPanel) {
    if (filters.date && filters.date.active && filters.date.active !== "Custom") count++;
    (filters.pills || []).forEach((g) => (count += (g.selected || []).length));
    if (filters.segmented && filters.segmented.active) count++;
  }
  return `
    <div class="paper outlined" style="margin-bottom:16px;">
      <div class="toolbar">
        <div class="search-col">
          <div class="search-field">
            ${icon("search")}
            <input class="input" placeholder="${placeholder}" />
          </div>
          ${required ? `<div class="field-error">Required</div>` : ""}
        </div>
        ${hasPanel
          ? `<label class="btn btn-outlined filters-trigger" for="filters-open">${icon("faders")} Filters ${count ? `<span class="count-badge">${count}</span>` : ""}</label>`
          : (showFilters ? `<label class="switch"><input type="checkbox" role="switch" /> Show additional filters</label>` : "")}
        ${hasPanel ? `<button class="btn btn-filled">Search</button>` : (btnRow(actions) || `<button class="btn btn-filled">Search</button>`)}
      </div>
      ${hasPanel ? filtersDrawer(filters) : ""}
    </div>`;
}

// ---- Detail card + grid -------------------------------------------------
export function card(title, inner, extraClass = "") {
  return `<div class="paper outlined ${extraClass}">
    ${title ? `<div class="section-title" style="margin-top:0;">${title}</div>` : ""}
    ${inner}
  </div>`;
}

export function detailGrid(pairs) {
  return `<div class="detail-grid">${pairs
    .map(([k, v]) => `<div class="detail-row"><div class="k">${k}</div><div class="v">${v}</div></div>`)
    .join("")}</div>`;
}

// ---- Stat cards ---------------------------------------------------------
export function statCards(stats) {
  return `<div class="stat-row">${stats
    .map(
      (s) => `<div class="paper elevated stat-card">
        <div class="caption">${s.label}</div>
        <div class="stat-value">${s.value}</div>
        ${s.sub ? `<div class="caption ${s.subClass || ""}">${s.sub}</div>` : ""}
      </div>`
    )
    .join("")}</div>`;
}

// ---- Tabs ---------------------------------------------------------------
// tabs: [{ id, label, content }]
export function tabbed(tabs) {
  const heads = tabs
    .map((t, i) => `<button class="tab ${i === 0 ? "active" : ""}" data-tab="${t.id}">${t.label}</button>`)
    .join("");
  const panels = tabs
    .map((t, i) => `<div class="tab-panel ${i === 0 ? "active" : ""}" data-panel="${t.id}">${t.content}</div>`)
    .join("");
  return `<div class="tabs"><div class="tab-bar">${heads}</div>${panels}</div>`;
}

// ---- Form ---------------------------------------------------------------
// fields: [{ label, type, placeholder, options, value, full }]
export function formGrid(fields) {
  return `<div class="form-grid">${fields
    .map((f) => {
      let control;
      if (f.type === "select") {
        control = `<select class="select" style="width:100%">${(f.options || [])
          .map((o) => `<option>${o}</option>`)
          .join("")}</select>`;
      } else if (f.type === "textarea") {
        control = `<textarea class="input" style="width:100%;min-height:96px" placeholder="${f.placeholder || ""}">${f.value || ""}</textarea>`;
      } else if (f.type === "switch") {
        control = `<label class="switch"><input type="checkbox" ${f.value ? "checked" : ""} role="switch" /> ${f.on || "Enabled"}</label>`;
      } else {
        control = `<input class="input" style="width:100%" type="${f.type || "text"}" placeholder="${f.placeholder || ""}" value="${f.value || ""}" />`;
      }
      return `<div class="field ${f.full ? "full" : ""}"><label>${f.label}</label>${control}</div>`;
    })
    .join("")}</div>`;
}

export function emptyState(iconName, title, text) {
  return `<div class="paper outlined empty">
    ${icon(iconName, "")}
    <div class="h5" style="margin-top:8px;">${title}</div>
    <div class="caption" style="max-width:560px;margin:8px auto 0;">${text}</div>
  </div>`;
}
