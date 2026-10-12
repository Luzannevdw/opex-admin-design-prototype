// Page renderers — one per route. Faithful to the real app's columns/fields.
import * as C from "./components.js";
import * as D from "../data/mock.js";
import { allLinks } from "./nav.js";

const { money, chip, statusChip, copyCell, pageHeader, icon, dataTable,
        searchToolbar, card, detailGrid, statCards, tabbed, formGrid,
        emptyState } = C;

const amt = (r) => `<span class="${r.amount < 0 ? "amount-neg" : ""}">${money(r.amount, r.currency)}</span>`;

// ================================================================= Core
export function home() {
  return `<div class="home-view">
      <div class="h3">Hello, Designer! 👋🏼</div>
      <div class="subtitle1 muted">Welcome to Opex UI — feel free to browse around!</div>
      <button class="btn btn-outlined home-feedback-trigger" type="button" data-open-feedback>Share feedback</button>
      <dialog class="feedback-card" id="feedback-survey" aria-labelledby="feedback-title">
        <form class="feedback-survey">
          <header class="feedback-header">
            <div class="feedback-heading">
              ${icon("feedback", "feedback-heading-icon")}
              <div>
                <h2 id="feedback-title" tabindex="-1">Feedback form</h2>
                <p class="feedback-eyebrow" data-feedback-progress>Step 1 of 2</p>
              </div>
            </div>
            <button class="feedback-close" type="button" data-feedback-close aria-label="Close feedback survey">${icon("close")}</button>
          </header>

          <section data-feedback-step="1" aria-labelledby="feedback-rating-question">
            <div class="feedback-intro">
              ${icon("check")}
              <span>A quick rating, then a couple of questions.</span>
            </div>
            <h2 class="feedback-question" id="feedback-rating-question" tabindex="-1">How likely are you to recommend OpEx UI to a colleague?</h2>
            <fieldset class="feedback-fieldset" aria-labelledby="feedback-rating-question">
              <legend class="sr-only">Select a rating from 0 to 10</legend>
              <div class="feedback-rating">
                ${Array.from({ length: 11 }, (_, n) => `<label><input type="radio" name="rating" value="${n}"><span>${n}</span></label>`).join("")}
              </div>
              <div class="feedback-scale-labels"><span>Not at all likely</span><span>Extremely likely</span></div>
            </fieldset>
            <div class="feedback-actions"><button class="btn btn-filled" type="button" data-feedback-next disabled>Next</button></div>
          </section>

          <section data-feedback-step="2" aria-labelledby="feedback-issues-question" hidden>
            <h2 class="feedback-question" id="feedback-issues-question" tabindex="-1">What isn’t working well for you?</h2>
            <p class="feedback-required" id="feedback-issue-hint">Select at least one.</p>
            <fieldset class="feedback-fieldset" aria-labelledby="feedback-issues-question" aria-describedby="feedback-issue-hint" aria-required="true">
              <legend class="sr-only">Select at least one issue</legend>
              <div class="feedback-options">
                ${["Finding information", "Speed and performance", "Navigation", "Completing tasks", "Errors or bugs", "Nothing in particular"]
                  .map((option) => `<label><input type="checkbox" name="issue" value="${option}"><span>${option}</span></label>`).join("")}
              </div>
            </fieldset>
            <label class="feedback-question feedback-text-label" for="feedback-message">Anything else you’d like to share?</label>
            <p class="feedback-required" id="feedback-message-hint">Required</p>
            <textarea id="feedback-message" name="message" rows="4" required aria-describedby="feedback-message-hint" placeholder="Tell us what could be better, what’s working well, or any ideas you have."></textarea>
            <div class="feedback-actions">
              <button class="btn btn-outlined" type="button" data-feedback-back>Back</button>
              <button class="btn btn-filled" type="button" data-feedback-submit disabled>Submit</button>
            </div>
          </section>

          <section class="feedback-thanks" data-feedback-step="thanks" hidden>
            <span class="feedback-success-mark" aria-hidden="true">${icon("check")}</span>
            <h2 class="feedback-question" tabindex="-1">Thanks for sharing.</h2>
            <p>Your feedback helps us improve OpEx UI.</p>
            <div class="feedback-actions"><button class="btn btn-text" type="button" data-feedback-close>Close</button></div>
          </section>
        </form>
      </dialog>
    </div>`;
}

export function transactionsPage() {
  return pageHeader("Transactions", "Search transactions across all merchants and terminals") +
    searchToolbar({
      placeholder: "Search by Merchant ID, Transaction ID or Terminal ID",
      showFilters: true,
      required: false,
      filters: {
        date: {
          options: ["Today", "Yesterday", "Last 7 days", "Last 30 days", "This month", "Custom"],
          active: "Last 30 days",
          custom: { year: 2026, month: 6, start: [2026, 6, 8], end: [2026, 7, 2] },
        },
        pills: [
          { label: "Schemes", options: ["Visa", "Mastercard", "Amex", "Maestro"] },
          { label: "Types", options: ["Sale", "Refund", "Reversal", "Pre-auth", "Capture"] },
          { label: "Products", options: ["Card Present", "Online", "MOTO"] },
        ],
        segmented: { label: "Outcome", options: ["All", "Authorised", "Declined", "Pending"], active: "All" },
        range: { label: "Amount (£)", min: 0, max: 1000, from: 0, to: 1000, prefix: "£" },
        text: { label: "Last 4 card digits", placeholder: "•••• 1234" },
        toggles: ["Reversed", "DCC"],
        resultCount: D.transactions.length,
      },
    }) +
    `<div id="tx-table" data-tx-results>${txTable(D.transactions)}</div>`;
}

const TX_COLUMNS = [
  { label: "Transaction id", render: (r) => C.copyCell(r.id) },
  { label: "Date time", render: (r) => r.date },
  { label: "Amount", render: amt },
  { label: "Scheme", render: (r) => r.scheme },
  { label: "Type", render: (r) => chip(r.type) },
  { label: "Product", render: (r) => chip(r.product) },
  { label: "Outcome", render: (r) => statusChip(r.outcome) },
];

const txTable = (rows) =>
  dataTable({ rowNav: "transactions/details", columns: TX_COLUMNS, rows });

// ---- Live filtering (prototype interactivity) ---------------------------
const TX_TODAY = new Date(2026, 6, 28); // matches mock data "now"

function txDatePart(s) {
  const [y, m, d] = s.slice(0, 10).split("-").map(Number);
  return new Date(y, m - 1, d);
}

function txInDateWindow(rowDate, preset, custom) {
  if (!preset || preset === "All") return true;
  const rd = txDatePart(rowDate);
  const today = TX_TODAY;
  const dayMs = 86400000;
  const diff = Math.round((today - rd) / dayMs);
  switch (preset) {
    case "Today": return diff === 0;
    case "Yesterday": return diff === 1;
    case "Last 7 days": return diff >= 0 && diff <= 6;
    case "Last 30 days": return diff >= 0 && diff <= 29;
    case "This month": return rd.getMonth() === today.getMonth() && rd.getFullYear() === today.getFullYear();
    case "Custom": {
      if (!custom) return true;
      const s = new Date(custom.start[0], custom.start[1], custom.start[2]);
      const e = new Date(custom.end[0], custom.end[1], custom.end[2]);
      return rd >= s && rd <= e;
    }
    default: return true;
  }
}

function txMatches(r, s) {
  if (s.search && !r.id.toLowerCase().includes(s.search.toLowerCase())) return false;
  if (s.last4 && !(r.last4 || "").includes(s.last4)) return false;
  if (s.schemes.length && !s.schemes.includes(r.scheme)) return false;
  if (s.types.length && !s.types.includes(r.type)) return false;
  if (s.products.length && !s.products.includes(r.product)) return false;
  if (s.outcome && s.outcome !== "All" && r.outcome !== s.outcome) return false;
  const absPounds = Math.abs(r.amount) / 100;
  if (absPounds < s.amtFrom || absPounds > s.amtTo) return false;
  if (s.reversed && r.type !== "Reversal") return false;
  if (s.dcc && !r.dcc) return false;
  if (!txInDateWindow(r.date, s.date, s.custom)) return false;
  return true;
}

// Wire the Transactions filter drawer to the table. Called after render.
export function wireTransactions() {
  const container = document.getElementById("tx-table");
  if (!container) return;
  const drawer = document.querySelector(".filters-drawer");
  if (!drawer) return;

  const custom = { year: 2026, month: 6, start: [2026, 6, 8], end: [2026, 7, 2] };
  const searchInput = document.querySelector(".search-field input.input");
  const rangeInputs = [...drawer.querySelectorAll(".range-input")];
  const rangeFill = drawer.querySelector(".range-fill");
  const rangeVals = drawer.querySelectorAll(".range-vals span");
  const rMin = Number(rangeInputs[0]?.min ?? 0);
  const rMax = Number(rangeInputs[0]?.max ?? 1000);

  const checkedVals = (name) =>
    [...drawer.querySelectorAll(`input[name="${name}"]:checked`)].map((i) => i.value);

  function readState() {
    const [a, b] = rangeInputs.map((i) => Number(i.value));
    const amtFrom = Math.min(a, b), amtTo = Math.max(a, b);
    const toggle = (label) =>
      [...drawer.querySelectorAll(".fd-toggles label")].some(
        (l) => l.textContent.trim() === label && l.querySelector("input").checked
      );
    return {
      search: searchInput ? searchInput.value.trim() : "",
      last4: (drawer.querySelector(".fd-block .fd-text")?.value || "").trim(),
      date: drawer.querySelector('input[name="date-preset"]:checked')?.value || "",
      schemes: checkedVals("Schemes"),
      types: checkedVals("Types"),
      products: checkedVals("Products"),
      outcome: drawer.querySelector('input[name="segmented"]:checked')?.value || "All",
      amtFrom, amtTo,
      reversed: toggle("Reversed"),
      dcc: toggle("DCC"),
      custom,
    };
  }

  function updateRangeUI(s) {
    if (rangeFill) {
      rangeFill.style.left = ((s.amtFrom - rMin) / (rMax - rMin)) * 100 + "%";
      rangeFill.style.right = 100 - ((s.amtTo - rMin) / (rMax - rMin)) * 100 + "%";
    }
    if (rangeVals.length === 2) {
      rangeVals[0].textContent = "£" + s.amtFrom.toLocaleString();
      rangeVals[1].textContent = "£" + s.amtTo.toLocaleString();
    }
  }

  function activeChipList(s) {
    const list = [];
    if (s.date && s.date !== "Custom") list.push(s.date);
    s.schemes.forEach((v) => list.push(v));
    s.types.forEach((v) => list.push(v));
    s.products.forEach((v) => list.push(v));
    if (s.outcome && s.outcome !== "All") list.push(s.outcome);
    if (s.reversed) list.push("Reversed");
    if (s.dcc) list.push("DCC");
    return list;
  }

  function updateChrome(s, count) {
    // badge counts (trigger + drawer header)
    const chips = activeChipList(s);
    document.querySelectorAll(".count-badge").forEach((b) => (b.textContent = chips.length));
    document.querySelectorAll(".count-badge").forEach((b) => (b.style.display = chips.length ? "" : "none"));
    // active chip bar
    const bar = drawer.querySelector(".fd-active");
    if (bar) {
      bar.innerHTML =
        chips
          .map((c) => `<span class="active-chip" data-chip="${c}">${c}<i class="ph ph-x"></i></span>`)
          .join("") + `<button class="fd-clear">Clear all</button>`;
      bar.style.display = chips.length ? "" : "none";
      bar.querySelectorAll(".active-chip .ph-x").forEach((x) => {
        x.addEventListener("click", () => removeChip(x.parentElement.dataset.chip));
      });
      bar.querySelector(".fd-clear")?.addEventListener("click", reset);
    }
    // footer results label
    const showBtn = drawer.querySelector(".fd-footer .btn-filled");
    if (showBtn) showBtn.textContent = `Show ${count} result${count === 1 ? "" : "s"}`;
  }

  function apply() {
    const s = readState();
    updateRangeUI(s);
    const rows = D.transactions.filter((r) => txMatches(r, s));
    container.innerHTML = txTable(rows);
    rebindTable(container);
    updateChrome(s, rows.length);
  }

  function removeChip(val) {
    // uncheck any pill/segmented input matching, or clear date/toggle
    drawer
      .querySelectorAll('.pill input, input[name="segmented"]')
      .forEach((i) => { if (i.value === val && i.checked) i.checked = i.type === "radio" ? false : false; });
    if (["Reversed", "DCC"].includes(val)) {
      [...drawer.querySelectorAll(".fd-toggles label")].forEach((l) => {
        if (l.textContent.trim() === val) l.querySelector("input").checked = false;
      });
    }
    // date chip → revert to no preset (show all)
    const dateRadio = drawer.querySelector(`input[name="date-preset"][value="${val}"]`);
    if (dateRadio) dateRadio.checked = false;
    // outcome chip → back to All
    const outRadio = drawer.querySelector(`input[name="segmented"][value="${val}"]`);
    if (outRadio) {
      const all = drawer.querySelector('input[name="segmented"][value="All"]');
      if (all) all.checked = true;
    }
    apply();
  }

  function reset() {
    drawer.querySelectorAll('.pill input[type="checkbox"]').forEach((i) => (i.checked = false));
    drawer.querySelectorAll('.fd-toggles input').forEach((i) => (i.checked = false));
    const all = drawer.querySelector('input[name="segmented"][value="All"]');
    if (all) all.checked = true;
    drawer.querySelectorAll('input[name="date-preset"]').forEach((i) => (i.checked = false));
    // Clear the Custom date-range calendar's visual selection
    drawer.querySelectorAll(".cal-cell").forEach((c) =>
      c.classList.remove("in-range", "range-start", "range-end")
    );
    drawer.querySelectorAll(".dr-summary .dr-val").forEach((v) => (v.textContent = "Select date"));
    rangeInputs[0] && (rangeInputs[0].value = rMin);
    rangeInputs[1] && (rangeInputs[1].value = rMax);
    const last4 = drawer.querySelector(".fd-block .fd-text");
    if (last4) last4.value = "";
    if (searchInput) searchInput.value = "";
    apply();
  }

  // Live updates on any drawer change + search typing
  drawer.addEventListener("change", apply);
  drawer.addEventListener("input", (e) => { if (e.target.classList.contains("range-input") || e.target.classList.contains("fd-text")) apply(); });
  if (searchInput) searchInput.addEventListener("input", apply);
  const resetBtn = drawer.querySelector(".fd-footer .btn-text");
  if (resetBtn) resetBtn.addEventListener("click", (e) => { e.preventDefault(); reset(); });
  const searchBtn = document.querySelector(".toolbar .btn-filled");
  if (searchBtn) searchBtn.addEventListener("click", (e) => { e.preventDefault(); apply(); });

  apply();
}

// Re-bind row navigation + copy buttons inside a freshly re-rendered container.
function rebindTable(container) {
  container.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => { location.hash = el.dataset.nav; });
  });
  C.bindCopyButtons(container);
}

export function transactionDetailsPage() {
  const d = D.transactionDetail;

  const steps = [
    { label: "Authorised", time: d.date, state: "done", icon: "check" },
    { label: "Captured", time: "2026-07-27 14:32:07", state: "done", icon: "check" },
    { label: "Settled", time: "Expected 2026-07-28", state: "todo", icon: "clock" },
  ];
  const timeline = `<ol class="tx-timeline">${steps
    .map((s) => `<li class="tx-step ${s.state}">
        <span class="tx-step-dot">${icon(s.icon)}</span>
        <span class="tx-step-label">${s.label}</span>
        <span class="tx-step-time">${s.time}</span>
      </li>`)
    .join("")}</ol>`;

  const hero = `<div class="paper outlined tx-hero">
      <div class="tx-hero-main">
        <div class="tx-hero-eyebrow">${d.type} · ${d.product}</div>
        <div class="tx-hero-amount">${money(d.amount, d.currency)}</div>
        <div class="tx-hero-chips">
          ${statusChip(d.status)}${chip(d.scheme)}${chip(d.entryMode)}
        </div>
        <div class="tx-hero-id">${copyCell(d.id)}</div>
      </div>
      <div class="tx-hero-actions">
        <button class="btn btn-outlined">${icon("swap_horiz")} Reverse</button>
        <button class="btn btn-filled">${icon("assignment_return")} Refund</button>
      </div>
    </div>`;

  return `<div class="tx-detail">` +
    `<div class="tx-detail-head">` +
    `<button class="btn btn-text tx-back" data-nav="transactions">${icon("arrow_back")} Back to transactions</button>` +
    pageHeader("Transaction details") +
    `</div>` +
    `<div class="tx-top">` +
    hero +
    card("Lifecycle", timeline, "tx-lifecycle") +
    `</div>` +
    `<div class="grid-2">` +
    card("Transaction", detailGrid([
      ["Type", chip(d.type)], ["Product", chip(d.product)], ["Scheme", d.scheme],
      ["Entry mode", d.entryMode], ["Date time", d.date], ["Auth code", d.authCode],
      ["Card last 4", `•••• ${d.cardLast4}`], ["ARN", copyCell(d.arn)],
    ])) +
    card("Merchant & terminal", detailGrid([
      ["Merchant", d.merchantName], ["Merchant ID", copyCell(d.merchantId)],
      ["Location ID", copyCell(d.locationId)], ["Terminal ID", copyCell(d.terminalId)],
      ["MCC", d.mcc],
    ])) + `</div>` + `</div>`;
}

// ========================================================== Settlements
export function dailyPayoutsPage() {
  const summary = dataTable({
    columns: [
      { label: "Status", render: (r) => statusChip(r.status) },
      { label: "Count", render: (r) => r.count },
      { label: "Amount", render: (r) => money(r.amount) },
    ],
    rows: D.dailyPayoutSummary,
  });
  const list = dataTable({
    rowNav: "all-payouts",
    columns: [
      { label: "Payout ID", render: (r) => copyCell(r.id) },
      { label: "Merchant", render: (r) => r.merchant },
      { label: "Amount", render: amt },
      { label: "Status", render: (r) => statusChip(r.status) },
      { label: "Banking Window", render: (r) => r.window },
    ],
    rows: D.payouts,
  });
  return pageHeader("Daily Payouts", "Payouts scheduled and settled for the selected day") +
    `<div class="toolbar" style="margin-bottom:16px;">
       <div class="field"><label>Date</label><input class="input" type="date" value="2026-07-27" /></div>
       <button class="btn btn-filled" style="align-self:flex-end;">Apply</button>
     </div>` +
    `<div class="section-title" style="margin-top:0;">Summary</div>` + summary +
    `<div class="section-title">Payouts</div>` + list;
}

export function allPayoutsPage() {
  return pageHeader("All Payouts") +
    searchToolbar({ placeholder: "Search by Customer ID, Merchant ID or Payout ID", showFilters: true }) +
    dataTable({
      columns: [
        { label: "Payout ID", render: (r) => copyCell(r.id) },
        { label: "Created At", render: (r) => r.created },
        { label: "Completed At", render: (r) => r.completed },
        { label: "Payout Amount", render: amt },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Customer ID", render: (r) => r.customerId },
        { label: "Merchant ID", render: (r) => r.mid },
        { label: "Banking Window", render: (r) => r.window },
        { label: "Settlement Cadence", render: (r) => r.cadence },
      ],
      rows: D.payouts,
    });
}

export function payoutInstructionsPage() {
  return pageHeader("All Payout Instructions") +
    searchToolbar({ placeholder: "Search by Payout Instruction ID or Customer ID", showFilters: true }) +
    dataTable({
      columns: [
        { label: "Payout Instruction ID", render: (r) => copyCell(r.id) },
        { label: "Created At", render: (r) => r.created },
        { label: "Reason", render: (r) => r.reason },
        { label: "Instruction Status", render: (r) => statusChip(r.status) },
        { label: "Customer ID", render: (r) => r.customerId },
        { label: "MID", render: (r) => r.mid },
        { label: "Payout ID", render: (r) => r.payoutId },
        { label: "Payout Status", render: (r) => statusChip(r.payoutStatus) },
        { label: "Instruction Amount", render: (r) => money(r.instructionAmount, r.currency) },
        { label: "Settlement Gateway", render: (r) => r.gateway },
      ],
      rows: D.payoutInstructions,
    });
}

export function adjustmentsPage() {
  return pageHeader("All Adjustments") +
    searchToolbar({ placeholder: "Search by Customer ID or Merchant ID", showFilters: true }) +
    dataTable({
      columns: [
        { label: "Adjustment ID", render: (r) => copyCell(r.id) },
        { label: "Created At", render: (r) => r.created },
        { label: "Customer ID", render: (r) => r.customerId },
        { label: "Merchant ID", render: (r) => r.mid },
        { label: "Type", render: (r) => chip(r.type) },
        { label: "Amount", render: amt },
        { label: "Status", render: (r) => statusChip(r.status) },
      ],
      rows: D.adjustments,
    });
}

export function settlementsPage() {
  return pageHeader("All Settlements") +
    searchToolbar({ placeholder: "Search by Settlement ID, Customer ID or Merchant ID", showFilters: true }) +
    dataTable({
      columns: [
        { label: "Settlement ID", render: (r) => copyCell(r.id) },
        { label: "Created At", render: (r) => r.created },
        { label: "Actioned At", render: (r) => r.actioned },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Customer ID", render: (r) => r.customerId },
        { label: "Merchant ID", render: (r) => r.mid },
        { label: "Accrued Amount", render: (r) => money(r.accrued) },
        { label: "Payout Amount", render: (r) => money(r.payout) },
        { label: "Trader Name", render: (r) => r.trader },
      ],
      rows: D.settlements,
    });
}

export function profilesPage() {
  return pageHeader("All Profiles") +
    searchToolbar({ placeholder: "Search by Profile ID, Merchant ID or Customer ID" }) +
    dataTable({
      columns: [
        { label: "Profile ID", render: (r) => copyCell(r.profileId) },
        { label: "Merchant ID", render: (r) => r.mid },
        { label: "Trading Name", render: (r) => r.trading },
        { label: "Market", render: (r) => r.market },
        { label: "Customer ID", render: (r) => r.customerId },
        { label: "Customer Ref.", render: (r) => r.customerRef },
        { label: "Status", render: (r) => statusChip(r.status) },
      ],
      rows: D.profiles,
    });
}

// ============================================================== Payments
export function paymentIntentsPage() {
  return pageHeader("Payment Intents") +
    searchToolbar({ placeholder: "Search by Payment Intent ID or Location", showFilters: true }) +
    dataTable({
      columns: [
        { label: "Id", render: (r) => copyCell(r.id) },
        { label: "Amount", render: (r) => money(r.amount, r.currency) },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Location", render: (r) => r.location },
        { label: "Market", render: (r) => r.market },
        { label: "Payment Source", render: (r) => chip(r.source) },
        { label: "Payment Type", render: (r) => chip(r.type) },
        { label: "Created At", render: (r) => r.created },
      ],
      rows: D.paymentIntents,
    });
}

export function setupIntentsPage() {
  return pageHeader("Setup Intents") +
    searchToolbar({ placeholder: "Search by Setup Intent ID or Location" }) +
    dataTable({
      columns: [
        { label: "Id", render: (r) => copyCell(r.id) },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Intended Amount", render: (r) => money(r.intended) },
        { label: "Location Id", render: (r) => r.location },
        { label: "Trading Name", render: (r) => r.trading },
        { label: "Payment Source", render: (r) => chip(r.source) },
        { label: "Created At", render: (r) => r.created },
      ],
      rows: D.setupIntents,
    });
}

export function payByBankPage() {
  return pageHeader("Pay By Bank") +
    searchToolbar({ placeholder: "Enter a Location ID", actions: [{ text: "Search", variant: "btn-filled" }, { text: "Bulk Approve", icon: "done_all" }] }) +
    dataTable({
      columns: [
        { label: "Id", render: (r) => copyCell(r.id) },
        { label: "Amount", render: (r) => money(r.amount, r.currency) },
        { label: "Location", render: (r) => r.location },
        { label: "PBB Status", render: (r) => statusChip(r.pbbStatus) },
        { label: "PI Status", render: (r) => statusChip(r.piStatus) },
        { label: "References", render: (r) => r.references },
        { label: "Updated At", render: (r) => r.updated },
      ],
      rows: D.payByBank,
    });
}

// ========================================================= Transaction API
export function transactionsV1Page() {
  return pageHeader("Transaction V1", "dojo for business") +
    searchToolbar({ placeholder: "Enter a Location ID", showFilters: true, actions: [{ text: "Search", variant: "btn-filled" }] }) +
    dataTable({
      rowNav: "transactions/details",
      columns: [
        { label: "Transaction id", render: (r) => copyCell(r.id) },
        { label: "Date time", render: (r) => r.date },
        { label: "Amount", render: amt },
        { label: "Scheme", render: (r) => r.scheme },
        { label: "Type", render: (r) => chip(r.type) },
        { label: "Outcome", render: (r) => statusChip(r.outcome) },
      ],
      rows: D.transactions,
    });
}

export function transactionsV3Page() {
  return pageHeader("Transaction V3", "sidekick") +
    searchToolbar({ placeholder: "Enter a Location ID", showFilters: true, actions: [{ text: "Search", variant: "btn-filled" }] }) +
    dataTable({
      rowNav: "transactions-v3/details",
      columns: [
        { label: "Transaction id", render: (r) => copyCell(r.id) },
        { label: "Date time", render: (r) => r.date },
        { label: "Amount", render: amt },
        { label: "Scheme", render: (r) => r.scheme },
        { label: "Product", render: (r) => chip(r.product) },
        { label: "Outcome", render: (r) => statusChip(r.outcome) },
      ],
      rows: D.transactions,
    });
}

// ========================================================= Account mgmt
export function customersPage() {
  return pageHeader("Customers") +
    searchToolbar({ placeholder: "Search by Customer ID or Account ID" }) +
    dataTable({
      striped: true,
      columns: [
        { label: "Id", render: (r) => copyCell(r.id) },
        { label: "Account Id", render: (r) => r.accountId },
        { label: "Trading Name", render: (r) => r.trading },
        { label: "Market", render: (r) => r.market },
        { label: "Status", render: (r) => statusChip(r.status) },
      ],
      rows: D.customers,
    });
}

export function locationsPage() {
  return pageHeader("Locations") +
    `<div class="paper outlined" style="margin-bottom:16px;">
       <div class="toolbar">
         <div class="field"><label>Search by</label>
           <select class="select" style="min-width:160px"><option>Location Id</option><option>Account Id</option></select></div>
         <div class="search-field" style="align-self:flex-end;"><input class="input" placeholder="Enter value" />${icon("search")}</div>
         <button class="btn btn-filled" style="align-self:flex-end;">Search</button>
       </div>
     </div>` +
    dataTable({
      columns: [
        { label: "Location Id", render: (r) => copyCell(r.locationId) },
        { label: "Account Id", render: (r) => r.accountId },
        { label: "Trading Name", render: (r) => r.trading },
        { label: "Account Name", render: (r) => r.accountName },
        { label: "Reseller", render: (r) => r.reseller },
        { label: "Software house", render: (r) => r.software },
        { label: "Product Name", render: (r) => r.product },
        { label: "Status", render: (r) => statusChip(r.status) },
      ],
      rows: D.locations,
    });
}

export function partnersPage() {
  return pageHeader("Partners") +
    searchToolbar({ placeholder: "Search by Partner name", actions: [{ text: "Add Partner", icon: "add", variant: "btn-outlined" }] }) +
    dataTable({
      columns: [
        { label: "Partner ID", render: (r) => copyCell(r.partnerId) },
        { label: "Partner Name", render: (r) => r.name },
        { label: "Business Name", render: (r) => r.business },
        { label: "Integration Type", render: (r) => chip(r.integration) },
        { label: "Email", render: (r) => r.email },
        { label: "Phone number", render: (r) => r.phone },
        { label: "Partner Type(s)", render: (r) => r.types },
      ],
      rows: D.partners,
    });
}

export function provisioningQueuePage() {
  return pageHeader("Provisioning Queue", "Locations awaiting remote payments provisioning") +
    statCards([
      { label: "In queue", value: D.provisioningQueue.length },
      { label: "Longest wait", value: "26m", subClass: "error" },
      { label: "Provisioned today", value: 47, sub: "▲ 12 vs yesterday", subClass: "success" },
    ]) +
    dataTable({
      columns: [
        { label: "Location Id", render: (r) => copyCell(r.locationId) },
        { label: "Market", render: (r) => r.market },
        { label: "Started At", render: (r) => r.started },
        { label: "Time in Queue", render: (r) => r.timeInQueue },
        { label: "", render: () => `<button class="btn btn-outlined">${icon("bolt")} Provision</button>` },
      ],
      rows: D.provisioningQueue,
    });
}

export function onlineCheckoutPage() {
  return pageHeader("Online Checkout Activation") +
    searchToolbar({ placeholder: "Search by Location ID or Trading Name" }) +
    dataTable({
      columns: [
        { label: "Id", render: (r) => copyCell(r.id) },
        { label: "Location Id", render: (r) => r.locationId },
        { label: "Trading Name", render: (r) => r.trading },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Assigned To", render: (r) => r.assignedTo },
        { label: "Created At", render: (r) => r.created },
        { label: "Time in Queue", render: (r) => r.timeInQueue },
        { label: "Web Site", render: (r) => r.website },
        { label: "Manually Approved", render: (r) => r.manual },
        { label: "Decline Reason", render: (r) => r.decline },
      ],
      rows: D.onlineCheckout,
    });
}

// ========================================================= Payment ops
export function almPage() {
  const accountsToolbar = `
    <div class="paper outlined alm-filters">
      <div class="field"><label>Currency</label>
        <select class="select"><option>All</option><option>GBP</option><option>EUR</option></select></div>
      <div class="field"><label>Bank Provider</label>
        <select class="select"><option>All</option><option>BC</option><option>Citi</option></select></div>
      <div class="field"><label>Purpose</label>
        <select class="select"><option>All</option><option>Settlement</option><option>Safeguarding</option></select></div>
      <button class="btn btn-text" style="align-self:flex-end;">${icon("close")} Reset</button>
      <button class="btn btn-outlined" style="align-self:flex-end;">${icon("refresh")} Refresh</button>
    </div>`;

  const accountCard = (a) => {
    const accent = a.provider === "Citi" ? "citi" : "bc";
    const details = a.iban
      ? [["IBAN", a.iban], ["BIC", a.bic]]
      : [["Account Number", a.accountNumber], ["Sort Code", a.sortCode]];
    return `
      <div class="alm-card accent-${accent}">
        <div class="alm-card-head">
          <div class="alm-card-title">${a.provider} ${a.purpose} - ${a.currency}</div>
          <div class="caption">Last sync at ${a.lastSync}</div>
        </div>
        <div class="alm-balance">
          ${icon("receipt_long", "alm-balance-icon")}
          <div class="alm-balance-label">Available balance</div>
          <div class="alm-balance-value">${money(a.available, a.currency)}</div>
          <div class="caption">Current: ${money(a.current, a.currency)}</div>
          <div class="alm-pending">
            ${icon("event_upcoming", "alm-pending-icon")}
            <span>Pending Payouts: <b>${money(a.pending, a.currency)}</b></span>
          </div>
        </div>
        <div class="alm-card-details">
          ${details.map(([k, v]) => `<div class="k">${k}</div><div class="v mono">${v}</div>`).join("")}
        </div>
      </div>`;
  };

  const accounts = accountsToolbar +
    `<div class="alm-grid">${D.almAccounts.map(accountCard).join("")}</div>`;

  const transfers = dataTable({
    columns: [
      { label: "Date", render: (r) => r.date }, { label: "From", render: (r) => r.from },
      { label: "To", render: (r) => r.to }, { label: "Amount", render: (r) => money(r.amount, r.currency) },
      { label: "Direction", render: (r) => chip(r.direction) }, { label: "Status", render: (r) => statusChip(r.status) },
      { label: "Description", render: (r) => r.description },
    ], rows: D.almTransfers,
  });
  const rules = dataTable({
    columns: [
      { label: "Rule", render: (r) => r.name }, { label: "Trigger", render: (r) => r.trigger },
      { label: "Action", render: (r) => r.action }, { label: "Status", render: (r) => statusChip(r.status) },
    ], rows: D.almRules,
  });
  const audit = emptyState("history", "Audit Logs", "A chronological log of every ALM action would appear here.");
  const stmts = emptyState("receipt_long", "Statements", "Bank statement lines per account would appear here.");
  const reqs = emptyState("pending_actions", "Transfer Requests", "Pending transfer requests awaiting approval would appear here.");
  return pageHeader("ALM", "Account & Liquidity Management") +
    `<div style="margin-bottom:16px;"><button class="btn btn-filled">${icon("add")} New Transfer</button></div>` +
    tabbed([
      { id: "accounts", label: `${icon("account_balance")} Accounts`, content: accounts },
      { id: "transfers", label: `${icon("swap_horiz")} Transfers`, content: transfers },
      { id: "requests", label: `${icon("pending_actions")} Transfer Requests`, content: reqs },
      { id: "rules", label: `${icon("rule")} Rules`, content: rules },
      { id: "statements", label: `${icon("description")} Statements`, content: stmts },
      { id: "audit", label: `${icon("history")} Audit Logs`, content: audit },
    ]);
}

// ============================================================== Terminals
export function connectTerminalsPage() {
  return pageHeader("Connect Terminals") +
    `<div class="paper outlined" style="margin-bottom:16px;">
       <div class="toolbar">
         <div class="field"><label>Search by</label>
           <select class="select" style="min-width:160px"><option>Location Id</option><option>Account Id</option></select></div>
         <div class="search-field" style="align-self:flex-end;"><input class="input" placeholder="Enter value" />${icon("search")}</div>
         <button class="btn btn-filled" style="align-self:flex-end;">Search</button>
       </div>
     </div>` +
    dataTable({
      columns: [
        { label: "Terminal Id", render: (r) => copyCell(r.terminalId) },
        { label: "TID", render: (r) => r.tid },
        { label: "Account Name", render: (r) => r.accountName },
        { label: "Trading Name", render: (r) => r.trading },
        { label: "Dojo Account ID", render: (r) => r.dojoAccountId },
        { label: "Environment", render: (r) => chip(r.environment) },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Last Updated At", render: (r) => r.updated },
      ],
      rows: D.connectTerminals,
    });
}

export function hardwareTerminalsPage() {
  return pageHeader("Terminals config") +
    searchToolbar({ placeholder: "Search by Terminal ID or Serial Number" }) +
    dataTable({
      rowNav: "hardware-terminals",
      columns: [
        { label: "Terminal ID", render: (r) => copyCell(r.terminalId) },
        { label: "Serial Number", render: (r) => r.serial },
        { label: "Merchant ID", render: (r) => r.mid },
        { label: "Customer ID", render: (r) => r.customerId },
      ],
      rows: D.hardwareTerminals,
    });
}

export function rkiUnbindPage() {
  return pageHeader("Request RKI Unbind", "Unbind terminals from Remote Key Injection") +
    card("", formGrid([
      { label: "Serial Numbers", type: "textarea", placeholder: "One serial number per line…", full: true },
    ]) + `<div class="form-actions"><button class="btn btn-filled">${icon("link_off")} Unbind</button><button class="btn btn-text">Clear</button></div>`);
}

export function demoTerminalPage() {
  return pageHeader("Demo Terminal", "Provision a demo terminal template") +
    card("", formGrid([
      { label: "Customer Id", placeholder: "CUS-…" },
      { label: "Merchant Id", placeholder: "MID-…" },
      { label: "Reseller Id", placeholder: "Optional" },
      { label: "Software House Id", placeholder: "Optional" },
      { label: "Supervisor Code", placeholder: "e.g. 0000" },
      { label: "Template Name", type: "select", options: ["Standard Retail", "Hospitality", "Pay at Table", "Unattended"] },
      { label: "Serial Numbers", type: "textarea", placeholder: "One serial number per line…", full: true },
    ]) + `<div class="form-actions"><button class="btn btn-filled">${icon("send")} Create Demo Terminal</button></div>`);
}

// ========================================================== Integrations
export function capabilitiesPage() {
  return pageHeader("Capabilities", "Search a merchant's capability version") +
    searchToolbar({ placeholder: "Enter account name" }) +
    dataTable({
      columns: [
        { label: "Account Name", render: (r) => r.account },
        { label: "Version", render: (r) => chip(r.version) },
        { label: "Updated At", render: (r) => r.updated },
      ],
      rows: D.capabilities,
    });
}

export function zonalPage() {
  return pageHeader("Zonal", "Configure a Zonal EPOS integration") +
    card("", formGrid([
      { label: "Account ID", placeholder: "ACC-…" }, { label: "Brand Name", placeholder: "e.g. Northgate" },
      { label: "Dojo Location ID", placeholder: "LOC-…" }, { label: "Enterprise ID", placeholder: "ENT-…" },
      { label: "Currency", type: "select", options: ["GBP", "EUR", "USD"] },
      { label: "Dine-in Order Types", placeholder: "Comma separated" },
      { label: "Collection Order Types", placeholder: "Comma separated" },
      { label: "Gratuity Item ID", placeholder: "Optional" },
    ]) + `<div class="form-actions"><button class="btn btn-filled">Save integration</button></div>`);
}

export function comtrexPage() {
  return pageHeader("Comtrex", "Configure a Comtrex EPOS integration") +
    card("", formGrid([
      { label: "Account ID", placeholder: "ACC-…" }, { label: "Comtrex URL", placeholder: "https://…" },
      { label: "Device ID", placeholder: "DEV-…" }, { label: "Device Type", type: "select", options: ["Fixed", "Mobile"] },
      { label: "Bundle Identifier", placeholder: "com.comtrex.…" }, { label: "Currency", type: "select", options: ["GBP", "EUR"] },
    ]) + `<div class="form-actions"><button class="btn btn-filled">Save integration</button></div>`);
}

export function donationsPage() {
  return pageHeader("Donations") +
    searchToolbar({ placeholder: "Search by Location or Trading Name", actions: [{ text: "Add Donation", icon: "add", variant: "btn-outlined" }] }) +
    dataTable({
      columns: [
        { label: "Donation Provider", render: (r) => r.provider },
        { label: "Location", render: (r) => r.location },
        { label: "Trading Name", render: (r) => r.trading },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Last Updated", render: (r) => r.updated },
      ],
      rows: D.donations,
    });
}

export function keyloopPage() {
  return pageHeader("Keyloop", "Automotive dealer integrations") +
    searchToolbar({ placeholder: "Search by Enterprise ID or Dealer", actions: [{ text: "Add Integration", icon: "add", variant: "btn-outlined" }] }) +
    dataTable({
      columns: [
        { label: "Enterprise ID", render: (r) => copyCell(r.enterpriseId) },
        { label: "Dealer", render: (r) => r.dealer },
        { label: "Store ID", render: (r) => r.storeId },
        { label: "Status", render: (r) => statusChip(r.status) },
        { label: "Last Updated", render: (r) => r.updated },
      ],
      rows: D.keyloop,
    });
}

// ====================================================== Embedded finance
export function youlendPage() {
  return pageHeader("Manage YouLend Integration", "Unmatched application events") +
    dataTable({
      columns: [
        { label: "Application ID (Lead ID)", render: (r) => copyCell(r.applicationId) },
        { label: "Provider", render: (r) => r.provider },
        { label: "Event Code", render: (r) => chip(r.eventCode) },
        { label: "Event Name", render: (r) => r.eventName },
        { label: "Created Date", render: (r) => r.created },
        { label: "Actions", render: () => `<button class="btn btn-outlined">${icon("build")} Fix association</button>` },
      ],
      rows: D.youlendUnmatched,
    });
}

// ================================================================= Tools
export function refundSettingsPage() {
  return pageHeader("Refund Settings") +
    `<div style="margin-bottom:16px;"><button class="btn btn-outlined">${icon("add")} Add setting</button></div>` +
    dataTable({
      columns: [
        { label: "Processor", render: (r) => r.processor },
        { label: "Schema", render: (r) => chip(r.schema) },
        { label: "MarketIds", render: (r) => r.markets },
        { label: "", render: () => `<button class="icon-btn">${icon("edit")}</button>` },
      ],
      rows: D.refundSettings,
    });
}

export function feesImportPage() {
  return pageHeader("Fees Import", `Today is ${new Date().toLocaleDateString("en-GB")}`) +
    card("", `<div class="dropzone">${icon("cloud_upload")}
        <div class="subtitle1" style="margin-top:8px;">Drop a fees CSV here, or click to browse</div>
        <div class="caption">Accepted format: .csv up to 10&nbsp;MB</div>
      </div>
      <div class="form-actions"><button class="btn btn-filled">${icon("upload")} Import fees</button></div>`);
}

export function dccSettingsPage() {
  return pageHeader("Dcc Settings", "Dynamic Currency Conversion risk margins") +
    dataTable({
      columns: [
        { label: "Currency A", render: (r) => r.a },
        { label: "Currency B", render: (r) => r.b },
        { label: "Risk Margin Normal (bsp)", render: (r) => r.normal },
        { label: "Risk Margin High (bsp)", render: (r) => r.high },
        { label: "Last Updated", render: (r) => r.updated },
        { label: "", render: () => `<button class="btn btn-outlined">${icon("edit")} Edit</button>` },
      ],
      rows: D.dccSettings,
    });
}

export function reportsPage() {
  return pageHeader("Reports", "Generate an operational report") +
    card("", formGrid([
      { label: "Customer ID", placeholder: "CUS-…" },
      { label: "Report type", type: "select", options: ["Settlement Summary", "Transaction Export", "Fees Breakdown", "Chargebacks"] },
      { label: "Date range", type: "date" },
      { label: "Format", type: "select", options: ["CSV", "XLSX", "PDF"] },
    ]) + `<div class="form-actions"><button class="btn btn-filled">${icon("download")} Generate report</button></div>`);
}

// ================================================================= Admin
export function usersPage() {
  return pageHeader("Users") +
    `<div class="toolbar" style="margin-bottom:12px;">
      <div class="field"><label>Roles</label><select class="select">${D.roles.map((r) => `<option>${r}</option>`).join("")}</select></div>
      <div class="spacer"></div>
      <div class="search-field" style="align-self:flex-end;"><input class="input" placeholder="Search" />${icon("search")}</div>
      <button class="btn btn-outlined" style="align-self:flex-end;">${icon("search")} Search</button>
      <button class="btn btn-outlined" style="align-self:flex-end;">${icon("add")} Add</button>
      <button class="btn btn-outlined" style="align-self:flex-end;">${icon("group")} Bulk</button>
    </div>` +
    dataTable({
      striped: true,
      columns: [
        { label: "Name", render: (r) => r.name },
        { label: "Email", render: (r) => r.email },
        { label: "Role", render: (r) => r.role },
        { label: "", render: () => `<button class="icon-btn">${icon("more_vert")}</button>` },
      ],
      rows: D.users,
    });
}

export function rolesPage() {
  const cell = (v) =>
    v === "-" ? `<span class="perm-no">${icon("remove")}</span>` : `<span class="chip success">${v}</span>`;
  const rows = D.permissionRoles
    .map(
      (r) => `<tr><td><b>${r.role}</b></td>${D.permissionFeatures
        .map((f) => `<td>${cell(r.perms[f])}</td>`)
        .join("")}</tr>`
    )
    .join("");
  return pageHeader("Roles and Permissions") +
    `<div style="margin-bottom:16px;"><button class="btn btn-outlined">${icon("add")} Add role</button></div>` +
    `<div class="table-wrap"><table class="tbl perm-matrix">
       <thead><tr><th>Role</th>${D.permissionFeatures.map((f) => `<th>${f}</th>`).join("")}</tr></thead>
       <tbody>${rows}</tbody>
     </table></div>
     <div class="caption" style="margin-top:8px;">C = Create · R = Read · U = Update · D = Delete</div>`;
}

export function feedbackPage() {
  return pageHeader("Feedback", "What users are telling us") +
    dataTable({
      columns: [
        { label: "User", render: (r) => r.user },
        { label: "Message", render: (r) => r.message },
        { label: "Performed At", render: (r) => r.performedAt },
      ],
      rows: D.feedback,
    });
}

// ============================================================ Placeholder
export function placeholder(href) {
  const link = allLinks.find((l) => l.href === href);
  const title = link ? link.text : href;
  return pageHeader(title, link && link.group ? link.group : "") +
    emptyState("draw", `“${title}” isn't built out yet`,
      "This page exists in the real app. It's a good place to sketch the redesigned version — the shell, nav, colours and typography around it are faithful to production.");
}
