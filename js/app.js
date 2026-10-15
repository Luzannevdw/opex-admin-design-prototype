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
let openFeedbackAfterRender = false;
let navExpanded = true;

function navLink(link) {
  const labels = `<span class="link-labels"><span>${link.text}</span>${
    link.subtext ? `<span class="subtext">${link.subtext}</span>` : ""
  }</span>`;
  return `<a class="nav-link" href="#${link.href}" data-href="${link.href}" aria-label="${link.text}" title="${link.text}">${icon(link.icon)}${labels}</a>`;
}

function navGroup(group) {
  return `
    <button class="nav-group-header" type="button" data-group="${group.title}"
      aria-label="${group.title}" title="${group.title}" aria-controls="nav-sidebar" aria-expanded="false">
      ${icon(group.icon)}<span class="nav-label">${group.title}</span>${icon("caret-right", "chevron")}
    </button>`;
}

function showSidebar(group) {
  const sidebar = document.getElementById("nav-sidebar");
  const drawer = document.getElementById("drawer");
  drawer.parentElement.classList.toggle("collapsed", !!group || !navExpanded);
  drawer.classList.toggle("collapsed", !navExpanded);
  const toggle = drawer.querySelector(".nav-toggle");
  toggle.setAttribute("aria-expanded", String(navExpanded));
  toggle.setAttribute("aria-label", navExpanded ? "Collapse navigation" : "Expand navigation");
  toggle.title = toggle.getAttribute("aria-label");
  document.querySelectorAll(".nav-group-header").forEach((button) => {
    const selected = button.dataset.group === group?.title;
    button.classList.toggle("active", selected);
    button.setAttribute("aria-expanded", String(selected));
  });
  sidebar.hidden = !group;
  if (!group) {
    sidebar.innerHTML = "";
    delete sidebar.dataset.group;
    return;
  }
  if (sidebar.dataset.group !== group.title) {
    sidebar.innerHTML = `
      <h2>${group.title}</h2>
      <nav aria-label="${group.title}">
        ${group.links.map((link) => `
          <a class="nav-sidebar-link" href="#${link.href}" data-href="${link.href}">
            <span>${link.text}</span>
            ${link.subtext ? `<span class="subtext">${link.subtext}</span>` : ""}
          </a>`).join("")}
      </nav>`;
    sidebar.dataset.group = group.title;
    sidebar.querySelectorAll(".nav-sidebar-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        navigate(link.dataset.href);
      });
    });
  }
  sidebar.querySelectorAll(".nav-sidebar-link").forEach((link) => {
    const selected = link.dataset.href === location.hash.slice(1);
    link.classList.toggle("active", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function renderDrawer() {
  return `
    <div class="drawer-header">
      <a data-href="home" style="display:flex;align-items:center;">
        <img class="brand-logo" src="assets/logo-opex.svg" alt="Dojo OPEX" />
      </a>
      <button class="nav-toggle" type="button" aria-controls="nav-primary" aria-expanded="true" aria-label="Collapse navigation" title="Collapse navigation">
        ${icon("caret-up")}${icon("caret-down")}
      </button>
    </div>
    <div class="nav-divider nav-header-divider" aria-hidden="true"></div>
    <nav class="nav" id="nav-primary" aria-label="Main navigation">
      ${navLink(topShelf[0])}
      ${topShelf.slice(1).map(navLink).join("")}
      ${groups.map(navGroup).join("")}
    </nav>
    <div class="nav-footer-wrap">
      <div class="nav-divider"></div>
      <div class="nav-footer">
        <button class="btn btn-text" type="button" data-open-feedback aria-label="Feedback" title="Feedback">${icon("feedback")}<span class="btn-label">Feedback</span></button>
        <button class="btn btn-outlined" type="button" aria-label="Change Access" title="Change Access">${icon("lock_open")}<span class="btn-label">Change Access</span></button>
        <button class="btn btn-filled" type="button" aria-label="Log out" title="Log out">${icon("logout")}<span class="btn-label">Log out</span></button>
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
  const group = groups.find((item) => item.links.some((link) => link.href === route));
  navExpanded = !group;
  document.querySelectorAll(".nav-link").forEach((el) => {
    el.classList.toggle("active", el.dataset.href === route);
  });
  showSidebar(group);
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
  // Re-trigger the page-enter animation on every route change
  main.classList.remove("page-enter");
  void main.offsetWidth; // force reflow so the animation restarts
  main.classList.add("page-enter");
  clearTimeout(main._peTimer);
  main._peTimer = setTimeout(() => main.classList.remove("page-enter"), 600);
  setActive(route);
  wireContentEvents();
  if (route === "home" && openFeedbackAfterRender) {
    openFeedbackAfterRender = false;
    openFeedback();
  }
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
  if (document.getElementById("feedback-survey")) wireFeedback();
  document.querySelectorAll("#main [data-open-feedback]").forEach((button) => {
    button.addEventListener("click", openFeedback);
  });
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
  const drawer = document.getElementById("drawer");
  const nav = document.getElementById("nav-primary");
  const updateNavScrollFade = () => {
    const remaining = Math.max(0, nav.scrollHeight - nav.clientHeight - nav.scrollTop);
    nav.style.setProperty("--nav-fade-top", `${Math.min(32, nav.scrollTop)}px`);
    nav.style.setProperty("--nav-fade-bottom", `${Math.min(32, remaining)}px`);
  };
  nav.addEventListener("scroll", updateNavScrollFade, { passive: true });
  window.addEventListener("resize", updateNavScrollFade);
  updateNavScrollFade();
  drawer.addEventListener("pointerleave", () => {
    if (drawer.classList.contains("collapsed")) drawer.classList.add("hover-suppressed");
  });
  drawer.addEventListener("pointerenter", (event) => {
    if (event.clientX < drawer.getBoundingClientRect().left + 80) {
      drawer.classList.remove("hover-suppressed");
    }
  });
  document.querySelector("#drawer [data-open-feedback]").addEventListener("click", openFeedback);
  document.querySelector(".nav-toggle").addEventListener("click", () => {
    navExpanded = !navExpanded;
    showSidebar(groups.find((group) => group.links.some((link) => link.href === location.hash.slice(1))));
  });
  document.querySelectorAll(".nav-group-header").forEach((h) => {
    h.addEventListener("click", () => {
      const group = groups.find((item) => item.title === h.dataset.group);
      navigate(group.links[0].href);
    });
  });
  document.querySelectorAll("#drawer [data-href]").forEach((el) => {
    el.addEventListener("click", (e) => {
      const href = el.dataset.href;
      if (href != null) {
        e.preventDefault();
        navigate(href);
      }
    });
  });
}

function openFeedback() {
  const survey = document.getElementById("feedback-survey");
  if (!survey) {
    openFeedbackAfterRender = true;
    navigate("home");
    return;
  }
  survey.showModal();
}

function wireFeedback() {
  const survey = document.getElementById("feedback-survey");
  const steps = [...survey.querySelectorAll("[data-feedback-step]")];
  const progress = survey.querySelector("[data-feedback-progress]");
  const rating = survey.querySelectorAll('input[name="rating"]');
  const next = survey.querySelector("[data-feedback-next]");
  const submit = survey.querySelector("[data-feedback-submit]");
  const message = survey.querySelector("#feedback-message");
  const options = [...survey.querySelectorAll('input[name="issue"]')];
  const nothing = options.find((option) => option.value === "Nothing in particular");

  function updateSubmit() {
    submit.disabled = !options.some((option) => option.checked) || !message.value.trim();
  }

  function showStep(step) {
    steps.forEach((panel) => { panel.hidden = panel.dataset.feedbackStep !== step; });
    progress.hidden = step === "thanks";
    if (step !== "thanks") progress.textContent = `Step ${step} of 2`;
    steps.find((panel) => panel.dataset.feedbackStep === step).querySelector("h2").focus();
  }

  survey.querySelector("form").addEventListener("submit", (event) => event.preventDefault());
  rating.forEach((input) => {
    input.addEventListener("change", () => { next.disabled = false; });
  });
  options.forEach((input) => {
    input.addEventListener("change", () => {
      if (input.checked) {
        if (input === nothing) {
          options.filter((option) => option !== nothing).forEach((option) => { option.checked = false; });
        } else {
          nothing.checked = false;
        }
      }
      updateSubmit();
    });
  });
  message.addEventListener("input", updateSubmit);
  survey.querySelector("[data-feedback-next]").addEventListener("click", () => {
    if (survey.querySelector('input[name="rating"]:checked')) showStep("2");
  });
  survey.querySelector("[data-feedback-back]").addEventListener("click", () => showStep("1"));
  submit.addEventListener("click", () => {
    if (survey.querySelector('input[name="rating"]:checked') && !submit.disabled) showStep("thanks");
  });
  survey.querySelectorAll("[data-feedback-close]").forEach((button) => {
    button.addEventListener("click", () => survey.close());
  });
  survey.addEventListener("close", () => {
    survey.querySelector("form").reset();
    next.disabled = true;
    submit.disabled = true;
    steps.forEach((panel) => { panel.hidden = panel.dataset.feedbackStep !== "1"; });
    progress.hidden = false;
    progress.textContent = "Step 1 of 2";
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
