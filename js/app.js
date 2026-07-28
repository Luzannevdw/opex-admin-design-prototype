// App shell: renders the drawer + routes hash URLs to page renderers.
import { topShelf, groups, allLinks } from "./nav.js";
import * as pages from "./pages.js";
import { icon, bindCopyButtons } from "./components.js";

const routes = {
  "": pages.home,
  "home": pages.home,
  "transactions": pages.transactionsPage,
  "transactions/details": pages.transactionDetailsPage,
  // Settlements
  "daily-payouts": pages.dailyPayoutsPage,
  "all-payouts": pages.allPayoutsPage,
  "all-payout-instructions": pages.payoutInstructionsPage,
  "all-adjustments": pages.adjustmentsPage,
  "all-settlements": pages.settlementsPage,
  "all-profiles": pages.profilesPage,
  // Payments
  "payment-intents": pages.paymentIntentsPage,
  "setup-intents": pages.setupIntentsPage,
  "pay-by-bank": pages.payByBankPage,
  // Transaction API
  "transactions-v1": pages.transactionsV1Page,
  "transactions-v3": pages.transactionsV3Page,
  "transactions-v3/details": pages.transactionDetailsPage,
  // Account Management
  "customers": pages.customersPage,
  "locations": pages.locationsPage,
  "partners": pages.partnersPage,
  "provisioning-queue": pages.provisioningQueuePage,
  "online-checkout-activation": pages.onlineCheckoutPage,
  // Payment Operations
  "alm": pages.almPage,
  // Terminals
  "terminals": pages.connectTerminalsPage,
  "rki-unbind": pages.rkiUnbindPage,
  "hardware-terminals": pages.hardwareTerminalsPage,
  "demo-terminal": pages.demoTerminalPage,
  // Integrations
  "capabilities": pages.capabilitiesPage,
  "zonal": pages.zonalPage,
  "comtrex": pages.comtrexPage,
  "donations": pages.donationsPage,
  "keyloop": pages.keyloopPage,
  // Embedded Finance
  "youlend-integration": pages.youlendPage,
  // Tools
  "refund-settings": pages.refundSettingsPage,
  "fees-import": pages.feesImportPage,
  "dcc-settings": pages.dccSettingsPage,
  "reports": pages.reportsPage,
  // Admin
  "users": pages.usersPage,
  "roles-and-permissions": pages.rolesPage,
  "feedback": pages.feedbackPage,
};

function navLink(link) {
  const labels = `<span class="link-labels"><span>${link.text}</span>${
    link.subtext ? `<span class="subtext">${link.subtext}</span>` : ""
  }</span>`;
  return `<a class="nav-link" data-href="${link.href}">${icon(link.icon)}${labels}</a>`;
}

function navGroup(group) {
  const links = group.links.map(navLink).join("");
  return `
    <div class="nav-group" data-group="${group.title}">
      <div class="nav-group-header">
        ${icon(group.icon)}<span>${group.title}</span>${icon("expand_more", "chevron")}
      </div>
      <div class="nav-group-body">${links}</div>
    </div>`;
}

function renderDrawer() {
  return `
    <div class="drawer-header">
      <a data-href="home" style="display:flex;align-items:center;">
        <img class="brand-logo" src="assets/logo-opex.svg" alt="Dojo OPEX" />
      </a>
    </div>
    <nav class="nav">
      ${topShelf.map(navLink).join("")}
      ${groups.map(navGroup).join("")}
    </nav>
    <div class="nav-footer-wrap">
      <div class="nav-divider"></div>
      <div class="nav-footer">
        <button class="btn btn-text">${icon("feedback")} Feedback</button>
        <button class="btn btn-outlined">${icon("lock_open")} Change Access</button>
        <button class="btn btn-filled">${icon("logout")} Log out</button>
      </div>
    </div>`;
}

function currentRoutePage(route) {
  if (routes[route]) return routes[route]();
  // Any known nav link without a dedicated page -> placeholder
  if (allLinks.some((l) => l.href === route)) return pages.placeholder(route);
  return pages.placeholder(route);
}

function setActive(route) {
  document.querySelectorAll(".nav-link").forEach((el) => {
    el.classList.toggle("active", el.dataset.href === route);
  });
  // Open the group that contains the active link
  document.querySelectorAll(".nav-group").forEach((g) => {
    const has = [...g.querySelectorAll(".nav-link")].some((l) => l.dataset.href === route);
    if (has) g.classList.add("open");
  });
}

function navigate(route) {
  if (location.hash !== `#${route}`) {
    location.hash = route;
    return; // hashchange handler will re-render
  }
  render(route);
}

function render(route) {
  const main = document.getElementById("main");
  main.innerHTML = currentRoutePage(route);
  main.scrollTop = 0;
  window.scrollTo(0, 0);
  setActive(route);
  wireContentEvents();
  if (pages.wireTransactions) pages.wireTransactions();
}

function toast(msg) {
  const el = document.getElementById("snackbar");
  el.textContent = msg;
  el.classList.add("show");
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove("show"), 1600);
}

function wireContentEvents() {
  // Row / element navigation
  document.querySelectorAll("[data-nav]").forEach((el) => {
    el.addEventListener("click", () => navigate(el.dataset.nav));
  });
  // Copy buttons (inline check + "Copied" feedback)
  bindCopyButtons(document);
  // Tabs (in-page, e.g. ALM)
  document.querySelectorAll(".tab[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tab;
      const container = btn.closest(".tabs");
      container.querySelectorAll(".tab").forEach((t) => t.classList.toggle("active", t === btn));
      container.querySelectorAll(".tab-panel").forEach((p) =>
        p.classList.toggle("active", p.dataset.panel === id)
      );
    });
  });
}

function wireShellEvents() {
  // Group expand/collapse
  document.querySelectorAll(".nav-group-header").forEach((h) => {
    h.addEventListener("click", () => h.parentElement.classList.toggle("open"));
  });
  // Nav links
  document.querySelectorAll(".nav-link[data-href], [data-href]").forEach((el) => {
    if (el.classList.contains("nav-group-header")) return;
    el.addEventListener("click", (e) => {
      const href = el.dataset.href;
      if (href != null) {
        e.preventDefault();
        navigate(href);
      }
    });
  });
}

function boot() {
  document.getElementById("drawer").innerHTML = renderDrawer();
  wireShellEvents();
  const route = location.hash.replace(/^#/, "") || "home";
  render(route);
  window.addEventListener("hashchange", () => {
    render(location.hash.replace(/^#/, "") || "home");
  });
}

boot();
