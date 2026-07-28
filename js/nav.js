// =========================================================================
// Navigation model — mirrors Components/Layout/NavigationLinks.cs
// Material icon names mapped to Google "Material Symbols Outlined".
// =========================================================================

export const topShelf = [
  { href: "home", text: "Home", icon: "home" },
  { href: "transactions", text: "Transactions", icon: "payments" },
];

export const groups = [
  {
    title: "Settlements", icon: "balance",
    links: [
      { href: "daily-payouts", text: "Daily Payouts", icon: "today" },
      { href: "all-payouts", text: "All Payouts", icon: "payments" },
      { href: "all-payout-instructions", text: "All Payout Instructions", icon: "integration_instructions" },
      { href: "all-adjustments", text: "All Adjustments", icon: "currency_exchange" },
      { href: "all-settlements", text: "All Settlements", icon: "recent_actors" },
      { href: "all-profiles", text: "All Profiles", icon: "layers" },
    ],
  },
  {
    title: "Payments", icon: "local_atm",
    links: [
      { href: "payment-intents", text: "Payment Intents", icon: "credit_card" },
      { href: "setup-intents", text: "Setup Intents", icon: "add_card" },
      { href: "pay-by-bank", text: "Pay By Bank", icon: "transfer_within_a_station" },
    ],
  },
  {
    title: "Transaction API", icon: "developer_mode",
    links: [
      { href: "transactions-v1", text: "Transaction V1", icon: "attach_money", subtext: "dojo for business" },
      { href: "transactions-v3", text: "Transaction V3", icon: "money_off", subtext: "sidekick" },
      { href: "transactions-v3/details", text: "Transaction V3", icon: "join_right", subtext: "transaction details" },
    ],
  },
  {
    title: "Account Management", icon: "app_settings_alt",
    links: [
      { href: "customers", text: "Customers", icon: "location_city" },
      { href: "locations", text: "Locations", icon: "location_on" },
      { href: "partners", text: "Partners", icon: "person" },
      { href: "provisioning-queue", text: "Provisioning Queue", icon: "plus_one" },
      { href: "online-checkout-activation", text: "Online Checkout Activation", icon: "shield" },
    ],
  },
  {
    title: "Payment Operations", icon: "account_balance",
    links: [
      { href: "alm", text: "ALM", icon: "payment" },
    ],
  },
  {
    title: "Terminals", icon: "point_of_sale",
    links: [
      { href: "terminals", text: "Connect Terminals", icon: "autorenew" },
      { href: "rki-unbind", text: "Request RKI Unbind", icon: "phonelink_setup" },
      { href: "hardware-terminals", text: "Terminals config", icon: "point_of_sale" },
      { href: "demo-terminal", text: "Demo Terminal", icon: "call_to_action" },
    ],
  },
  {
    title: "Integrations", icon: "integration_instructions",
    links: [
      { href: "capabilities", text: "Capabilities", icon: "integration_instructions" },
      { href: "zonal", text: "Zonal", icon: "add" },
      { href: "comtrex", text: "Comtrex", icon: "add" },
      { href: "donations", text: "Donations", icon: "volunteer_activism" },
      { href: "keyloop", text: "Keyloop", icon: "all_inclusive" },
    ],
  },
  {
    title: "Embedded Finance", icon: "account_balance_wallet",
    links: [
      { href: "youlend-integration", text: "Manage YouLend Integration", icon: "account_balance_wallet" },
    ],
  },
  {
    title: "Tools", icon: "science",
    links: [
      { href: "refund-settings", text: "Refund Settings", icon: "assignment_return" },
      { href: "fees-import", text: "Fees Import", icon: "attach_money" },
      { href: "dcc-settings", text: "Dcc Settings", icon: "settings" },
      { href: "reports", text: "Reports", icon: "report" },
    ],
  },
  {
    title: "Admin Fun", icon: "admin_panel_settings",
    links: [
      { href: "users", text: "Users", icon: "people" },
      { href: "roles-and-permissions", text: "Roles and Permissions", icon: "lock" },
      { href: "feedback", text: "Feedback", icon: "feedback" },
    ],
  },
];

// Flat lookup of every routable link, for titles / breadcrumbs.
export const allLinks = [
  ...topShelf,
  ...groups.flatMap((g) => g.links.map((l) => ({ ...l, group: g.title }))),
];
