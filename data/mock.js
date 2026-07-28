// Mock data for every prototype page. All fake / illustrative.

// ---------------------------------------------------------------- Core
export const transactions = [
  { id: "tx_9f3a12c7b0e14d2f", date: "2026-07-28 09:12:04", amount: 4250, currency: "GBP", scheme: "Visa", type: "Sale", product: "Card Present", outcome: "Authorised", last4: "4242", dcc: false },
  { id: "tx_1b8e44a9c7d3f0aa", date: "2026-07-28 08:41:11", amount: -1200, currency: "GBP", scheme: "Mastercard", type: "Refund", product: "Card Present", outcome: "Authorised", last4: "5588", dcc: false },
  { id: "tx_77c0e2119a4b6d8e", date: "2026-07-27 14:32:05", amount: 8990, currency: "GBP", scheme: "Visa", type: "Sale", product: "Online", outcome: "Declined", last4: "4111", dcc: true },
  { id: "tx_5da6f3b8271c9e40", date: "2026-07-27 13:41:33", amount: 15000, currency: "GBP", scheme: "Amex", type: "Sale", product: "Card Present", outcome: "Authorised", last4: "3400", dcc: false },
  { id: "tx_a4c81de6039b7f22", date: "2026-07-27 12:58:50", amount: -500, currency: "GBP", scheme: "Visa", type: "Reversal", product: "Card Present", outcome: "Authorised", last4: "4242", dcc: false },
  { id: "tx_2e9b7c04a1f8d365", date: "2026-07-26 19:22:07", amount: 3299, currency: "EUR", scheme: "Mastercard", type: "Sale", product: "Online", outcome: "Authorised", last4: "5100", dcc: true },
  { id: "tx_63f0b19d8c2a4e57", date: "2026-07-26 11:05:18", amount: 7499, currency: "GBP", scheme: "Visa", type: "Sale", product: "MOTO", outcome: "Declined", last4: "4712", dcc: false },
  { id: "tx_0c7e5a2f14b98d6a", date: "2026-07-25 16:30:02", amount: 2599, currency: "GBP", scheme: "Maestro", type: "Sale", product: "Card Present", outcome: "Authorised", last4: "6759", dcc: false },
  { id: "tx_84be1f0972ad3c65", date: "2026-07-24 10:15:44", amount: 12000, currency: "GBP", scheme: "Visa", type: "Pre-auth", product: "Online", outcome: "Pending", last4: "4999", dcc: false },
  { id: "tx_39ac7be015f2d840", date: "2026-07-23 09:48:12", amount: 640, currency: "GBP", scheme: "Mastercard", type: "Sale", product: "Card Present", outcome: "Authorised", last4: "5301", dcc: false },
  { id: "tx_c1f80a37e26b9d54", date: "2026-07-22 20:11:37", amount: 45000, currency: "GBP", scheme: "Amex", type: "Sale", product: "Online", outcome: "Authorised", last4: "3782", dcc: true },
  { id: "tx_7b20e9c4a1d83f06", date: "2026-07-21 14:03:29", amount: -2500, currency: "GBP", scheme: "Visa", type: "Refund", product: "Card Present", outcome: "Authorised", last4: "4242", dcc: false },
  { id: "tx_e6041ba9d7c25f83", date: "2026-07-20 08:22:55", amount: 1899, currency: "GBP", scheme: "Mastercard", type: "Sale", product: "Card Present", outcome: "Declined", last4: "5588", dcc: false },
  { id: "tx_5c9f20e18b7a4d36", date: "2026-07-18 17:40:10", amount: 9900, currency: "GBP", scheme: "Visa", type: "Capture", product: "Online", outcome: "Authorised", last4: "4111", dcc: false },
  { id: "tx_2a7db3910ce6f845", date: "2026-07-15 12:12:12", amount: 300, currency: "GBP", scheme: "Maestro", type: "Sale", product: "Card Present", outcome: "Authorised", last4: "6700", dcc: false },
  { id: "tx_bf0e63c1a9d72415", date: "2026-07-12 13:33:41", amount: 5625, currency: "GBP", scheme: "Visa", type: "Sale", product: "Card Present", outcome: "Authorised", last4: "4242", dcc: false },
  { id: "tx_913ac0f7e2b64d18", date: "2026-07-10 11:59:03", amount: -1500, currency: "GBP", scheme: "Amex", type: "Reversal", product: "Card Present", outcome: "Authorised", last4: "3400", dcc: false },
  { id: "tx_47e2b8d0961ac35f", date: "2026-07-05 15:27:48", amount: 22000, currency: "GBP", scheme: "Mastercard", type: "Sale", product: "MOTO", outcome: "Pending", last4: "5100", dcc: false },
  { id: "tx_60d9f1a4278be0c3", date: "2026-06-30 09:14:22", amount: 780, currency: "GBP", scheme: "Visa", type: "Sale", product: "Online", outcome: "Authorised", last4: "4712", dcc: true },
  { id: "tx_18c7e3b0942ad6f1", date: "2026-06-27 18:02:59", amount: 3410, currency: "GBP", scheme: "Visa", type: "Sale", product: "Card Present", outcome: "Declined", last4: "4999", dcc: false },
  { id: "tx_ac52f0916be7d340", date: "2026-06-24 10:41:07", amount: -900, currency: "GBP", scheme: "Mastercard", type: "Refund", product: "Online", outcome: "Authorised", last4: "5301", dcc: false },
  { id: "tx_e70b9d2c1a4f8365", date: "2026-06-21 16:55:33", amount: 67500, currency: "GBP", scheme: "Amex", type: "Sale", product: "Card Present", outcome: "Authorised", last4: "3782", dcc: false },
];

export const transactionDetail = {
  id: "tx_9f3a12c7b0e14d2f", status: "Authorised", amount: 4250, currency: "GBP", scheme: "Visa",
  type: "Sale", product: "Card Present", date: "2026-07-27 14:32:05", merchantId: "MID-4471209",
  merchantName: "The Copper Kettle Ltd", terminalId: "TRM-88213", locationId: "LOC-20194",
  cardLast4: "4242", authCode: "A1B2C3", arn: "74567890123456789012345",
  mcc: "5812 — Eating places, Restaurants", entryMode: "Contactless",
};

// ---------------------------------------------------------- Settlements
export const dailyPayoutSummary = [
  { status: "Paid", count: 182, amount: 4821050 },
  { status: "Pending", count: 24, amount: 738220 },
  { status: "Failed", count: 3, amount: 41575 },
];

export const payouts = [
  { id: "po_20260727_001", merchant: "The Copper Kettle Ltd", customerId: "CUS-10021", mid: "MID-4471209", amount: 128450, currency: "GBP", status: "Paid", created: "2026-07-27 06:00", completed: "2026-07-27 06:12", window: "Next Day", cadence: "Daily" },
  { id: "po_20260727_002", merchant: "Northgate Motors", customerId: "CUS-10088", mid: "MID-2210934", amount: 45210, currency: "GBP", status: "Pending", created: "2026-07-27 06:00", completed: "—", window: "Next Day", cadence: "Daily" },
  { id: "po_20260726_014", merchant: "Blue Harbour Cafe", customerId: "CUS-10105", mid: "MID-9982104", amount: 8990, currency: "GBP", status: "Paid", created: "2026-07-26 06:00", completed: "2026-07-26 06:09", window: "Same Day", cadence: "Daily" },
  { id: "po_20260726_009", merchant: "Studio 19 Salon", customerId: "CUS-10156", mid: "MID-5540021", amount: 15375, currency: "GBP", status: "Failed", created: "2026-07-26 06:00", completed: "—", window: "Next Day", cadence: "Weekly" },
];

export const payoutInstructions = [
  { id: "pi_88231", reason: "Scheduled", status: "Completed", customerId: "CUS-10021", mid: "MID-4471209", payoutId: "po_20260727_001", payoutStatus: "Paid", instructionAmount: 128450, payoutAmount: 128450, splitId: "SPL-01", gateway: "Modulr", currency: "GBP", created: "2026-07-27 05:55", completed: "2026-07-27 06:12" },
  { id: "pi_88232", reason: "Manual", status: "Pending", customerId: "CUS-10088", mid: "MID-2210934", payoutId: "po_20260727_002", payoutStatus: "Pending", instructionAmount: 45210, payoutAmount: 45210, splitId: "SPL-02", gateway: "Modulr", currency: "GBP", created: "2026-07-27 05:55", completed: "—" },
  { id: "pi_88190", reason: "Scheduled", status: "Failed", customerId: "CUS-10156", mid: "MID-5540021", payoutId: "po_20260726_009", payoutStatus: "Failed", instructionAmount: 15375, payoutAmount: 0, splitId: "SPL-03", gateway: "ClearBank", currency: "GBP", created: "2026-07-26 05:55", completed: "—" },
];

export const adjustments = [
  { id: "adj_5521", customerId: "CUS-10021", mid: "MID-4471209", type: "Chargeback", amount: -6500, currency: "GBP", status: "Completed", created: "2026-07-25 10:14" },
  { id: "adj_5522", customerId: "CUS-10105", mid: "MID-9982104", type: "Fee Correction", amount: 1200, currency: "GBP", status: "Pending", created: "2026-07-26 11:02" },
  { id: "adj_5523", customerId: "CUS-10088", mid: "MID-2210934", type: "Manual Credit", amount: 5000, currency: "GBP", status: "Completed", created: "2026-07-26 15:47" },
];

export const settlements = [
  { id: "set_44120", status: "Completed", customerId: "CUS-10021", mid: "MID-4471209", accrued: 129650, payout: 128450, trader: "The Copper Kettle Ltd", created: "2026-07-27 00:05", actioned: "2026-07-27 06:12" },
  { id: "set_44121", status: "Pending", customerId: "CUS-10088", mid: "MID-2210934", accrued: 45210, payout: 0, trader: "Northgate Motors", created: "2026-07-27 00:05", actioned: "—" },
  { id: "set_44098", status: "Failed", customerId: "CUS-10156", mid: "MID-5540021", accrued: 15375, payout: 0, trader: "Studio 19 Salon", created: "2026-07-26 00:05", actioned: "—" },
];

export const profiles = [
  { profileId: "prof_2001", mid: "MID-4471209", trading: "The Copper Kettle Ltd", market: "UK", customerId: "CUS-10021", customerRef: "REF-88a1", status: "Active" },
  { profileId: "prof_2002", mid: "MID-2210934", trading: "Northgate Motors", market: "UK", customerId: "CUS-10088", customerRef: "REF-91c4", status: "Active" },
  { profileId: "prof_2003", mid: "MID-9982104", trading: "Blue Harbour Cafe", market: "IE", customerId: "CUS-10105", customerRef: "REF-77b9", status: "Held" },
];

// ------------------------------------------------------------- Payments
export const paymentIntents = [
  { id: "pi_a1b2c3", amount: 4999, currency: "GBP", status: "Succeeded", location: "LOC-20194", market: "UK", source: "Card", type: "Online", created: "2026-07-27 14:10" },
  { id: "pi_d4e5f6", amount: 12000, currency: "GBP", status: "Requires Action", location: "LOC-20211", market: "UK", source: "Apple Pay", type: "Online", created: "2026-07-27 13:40" },
  { id: "pi_g7h8i9", amount: 750, currency: "EUR", status: "Declined", location: "LOC-30044", market: "IE", source: "Card", type: "MOTO", created: "2026-07-27 12:22" },
];

export const setupIntents = [
  { id: "si_11aa22", status: "Succeeded", intended: 0, location: "LOC-20194", trading: "The Copper Kettle Ltd", source: "Card", created: "2026-07-27 09:31" },
  { id: "si_33bb44", status: "Pending", intended: 2500, location: "LOC-20211", trading: "Northgate Motors", source: "Card", created: "2026-07-27 08:55" },
];

export const payByBank = [
  { id: "pbb_5a6b", amount: 8900, currency: "GBP", location: "LOC-20194", pbbStatus: "Completed", piStatus: "Succeeded", references: "INV-4471", updated: "2026-07-27 14:05" },
  { id: "pbb_7c8d", amount: 24500, currency: "GBP", location: "LOC-20211", pbbStatus: "Pending", piStatus: "Requires Action", references: "INV-4472", updated: "2026-07-27 13:48" },
  { id: "pbb_9e0f", amount: 1500, currency: "GBP", location: "LOC-30044", pbbStatus: "Failed", piStatus: "Declined", references: "INV-4473", updated: "2026-07-27 12:59" },
];

// ------------------------------------------------------ Account mgmt
export const customers = [
  { id: "CUS-10021", accountId: "ACC-77120", trading: "The Copper Kettle Ltd", market: "UK", status: "Active" },
  { id: "CUS-10088", accountId: "ACC-77188", trading: "Northgate Motors", market: "UK", status: "Active" },
  { id: "CUS-10105", accountId: "ACC-77205", trading: "Blue Harbour Cafe", market: "IE", status: "Held" },
  { id: "CUS-10156", accountId: "ACC-77256", trading: "Studio 19 Salon", market: "UK", status: "Active" },
];

export const locations = [
  { locationId: "LOC-20194", accountId: "ACC-77120", trading: "The Copper Kettle Ltd", accountName: "Copper Kettle", status: "Active", reseller: "Direct", software: "Dojo POS", product: "Card Machine" },
  { locationId: "LOC-20211", accountId: "ACC-77188", trading: "Northgate Motors", accountName: "Northgate", status: "Active", reseller: "Zonal", software: "Zonal EPOS", product: "Card Machine" },
  { locationId: "LOC-30044", accountId: "ACC-77205", trading: "Blue Harbour Cafe", accountName: "Blue Harbour", status: "Pending", reseller: "Comtrex", software: "Comtrex", product: "Online" },
];

export const partners = [
  { partnerId: "PRT-501", name: "Zonal", business: "Zonal Retail Data Systems", integration: "EPOS", email: "integrations@zonal.co.uk", phone: "+44 131 000 0000", types: "Software House" },
  { partnerId: "PRT-502", name: "Comtrex", business: "Comtrex Systems Ltd", integration: "EPOS", email: "support@comtrex.co.uk", phone: "+44 208 000 0000", types: "Software House" },
  { partnerId: "PRT-503", name: "Keyloop", business: "Keyloop Ltd", integration: "Automotive", email: "hello@keyloop.com", phone: "+44 118 000 0000", types: "Reseller, Software House" },
];

export const provisioningQueue = [
  { locationId: "LOC-40001", market: "UK", started: "2026-07-27 15:40", timeInQueue: "6m 12s" },
  { locationId: "LOC-40002", market: "IE", started: "2026-07-27 15:33", timeInQueue: "13m 40s" },
  { locationId: "LOC-40003", market: "UK", started: "2026-07-27 15:20", timeInQueue: "26m 05s" },
];

export const onlineCheckout = [
  { id: "OCA-9001", locationId: "LOC-20194", trading: "The Copper Kettle Ltd", status: "Approved", assignedTo: "chloe.nguyen", created: "2026-07-27 11:00", timeInQueue: "—", website: "copperkettle.co.uk", manual: "No", decline: "—" },
  { id: "OCA-9002", locationId: "LOC-30044", trading: "Blue Harbour Cafe", status: "Review", assignedTo: "ben.whitfield", created: "2026-07-27 10:20", timeInQueue: "1h 12m", website: "blueharbour.ie", manual: "Yes", decline: "—" },
  { id: "OCA-9003", locationId: "LOC-20211", trading: "Northgate Motors", status: "Rejected", assignedTo: "—", created: "2026-07-26 16:05", timeInQueue: "—", website: "northgatemotors.co.uk", manual: "Yes", decline: "Website not reachable" },
];

// ------------------------------------------------------ Payment ops (ALM)
export const almTransfers = [
  { date: "2026-07-27 09:00", from: "Ops Float GBP", to: "Merchant Pool GBP", amount: 5000000, currency: "GBP", direction: "Internal", status: "Completed", description: "Daily float top-up" },
  { date: "2026-07-27 10:15", from: "Merchant Pool GBP", to: "ClearBank Settlement", amount: 1284500, currency: "GBP", direction: "Outbound", status: "Processing", description: "Settlement batch 4471" },
  { date: "2026-07-26 17:40", from: "Fees Collection", to: "Ops Float GBP", amount: 92300, currency: "GBP", direction: "Internal", status: "Completed", description: "Fees sweep" },
];
export const almAccounts = [
  { provider: "BC", purpose: "Settlement", currency: "EUR", available: 150680, current: 4843288, pending: 0, iban: "LU24 4080 0000 0001 9581", bic: "BCIRLULL", lastSync: "15:21:58" },
  { provider: "BC", purpose: "Settlement", currency: "GBP", available: 123400, current: 123400, pending: 4467605, accountNumber: "00018515", sortCode: "608382", lastSync: "15:21:58" },
  { provider: "Citi", purpose: "Settlement", currency: "GBP", available: 0, current: 0, pending: 0, accountNumber: "14725948", sortCode: "185008", lastSync: "15:21:58" },
  { provider: "BC", purpose: "Safeguarding", currency: "EUR", available: 8842010, current: 8842010, pending: 0, iban: "LU81 4080 0000 0002 4417", bic: "BCIRLULL", lastSync: "15:21:58" },
  { provider: "BC", purpose: "Safeguarding", currency: "GBP", available: 219845503, current: 219845503, pending: 0, accountNumber: "00018516", sortCode: "608382", lastSync: "15:21:58" },
  { provider: "Citi", purpose: "Safeguarding", currency: "GBP", available: 154200000, current: 154200000, pending: 0, accountNumber: "14725949", sortCode: "185008", lastSync: "15:21:58" },
];
export const almRules = [
  { name: "Auto float top-up", trigger: "Balance < £2,000,000", action: "Transfer £5,000,000 from Fees", status: "On" },
  { name: "Overnight fees sweep", trigger: "Daily 17:30", action: "Sweep fees to Ops Float", status: "On" },
  { name: "Weekend hold", trigger: "Sat/Sun", action: "Hold outbound transfers", status: "Off" },
];

// ------------------------------------------------------------- Terminals
export const connectTerminals = [
  { terminalId: "TRM-88213", accountName: "Copper Kettle", trading: "The Copper Kettle Ltd", dojoAccountId: "ACC-77120", tid: "12345678", status: "Bound", environment: "Production", updated: "2026-07-27 08:00" },
  { terminalId: "TRM-88214", accountName: "Northgate", trading: "Northgate Motors", dojoAccountId: "ACC-77188", tid: "12345679", status: "Pending", environment: "Production", updated: "2026-07-27 07:40" },
];
export const hardwareTerminals = [
  { terminalId: "TRM-88213", serial: "PAX-A920-0012345", mid: "MID-4471209", customerId: "CUS-10021" },
  { terminalId: "TRM-88214", serial: "PAX-A920-0012346", mid: "MID-2210934", customerId: "CUS-10088" },
  { terminalId: "TRM-88215", serial: "PAX-A77-0098765", mid: "MID-9982104", customerId: "CUS-10105" },
];

// ---------------------------------------------------------- Integrations
export const capabilities = [
  { account: "The Copper Kettle Ltd", version: "v3.14.0", updated: "2026-07-25 09:12:03" },
  { account: "Northgate Motors", version: "v3.13.2", updated: "2026-07-22 16:40:11" },
];
export const donations = [
  { provider: "Pennies", location: "LOC-20194", trading: "The Copper Kettle Ltd", status: "Enabled", updated: "2026-07-20" },
  { provider: "WorkForGood", location: "LOC-30044", trading: "Blue Harbour Cafe", status: "Disabled", updated: "2026-07-18" },
];
export const keyloop = [
  { enterpriseId: "ENT-9001", dealer: "Northgate Motors", storeId: "STR-4471", status: "Active", updated: "2026-07-19" },
];

// ---------------------------------------------------- Embedded finance
export const youlendUnmatched = [
  { applicationId: "LEAD-77120", provider: "YouLend", eventCode: "APP_CREATED", eventName: "Application Created", created: "2026-07-27 09:00" },
  { applicationId: "LEAD-77188", provider: "YouLend", eventCode: "OFFER_ACCEPTED", eventName: "Offer Accepted", created: "2026-07-26 14:22" },
];

// ------------------------------------------------------------------ Tools
export const refundSettings = [
  { processor: "Adyen", schema: "Visa", markets: "UK, IE" },
  { processor: "Adyen", schema: "Mastercard", markets: "UK" },
  { processor: "Stripe", schema: "Amex", markets: "UK, IE, FR" },
];
export const dccSettings = [
  { a: "GBP", b: "EUR", normal: 250, high: 400, updated: "2026-07-24 10:00" },
  { a: "GBP", b: "USD", normal: 300, high: 450, updated: "2026-07-24 10:00" },
  { a: "EUR", b: "USD", normal: 275, high: 420, updated: "2026-07-20 09:30" },
];

// -------------------------------------------------------------- Admin
export const users = [
  { name: "Amara Okafor", email: "amara.okafor@dojo.tech", role: "Settlements Analyst" },
  { name: "Ben Whitfield", email: "ben.whitfield@dojo.tech", role: "Support Engineer" },
  { name: "Chloe Nguyen", email: "chloe.nguyen@dojo.tech", role: "Admin" },
  { name: "Diego Alvarez", email: "diego.alvarez@dojo.tech", role: "Read Only" },
  { name: "Esther Cole", email: "esther.cole@dojo.tech", role: "Payments Operations" },
  { name: "Farah Haddad", email: "farah.haddad@dojo.tech", role: "Admin" },
];
export const roles = ["All", "Admin", "Read Only", "Settlements Analyst", "Support Engineer", "Payments Operations"];

export const permissionFeatures = ["Transactions", "Settlements", "Payments", "Customers", "Locations", "Terminals", "Users", "Reports"];
export const permissionRoles = [
  { role: "Admin", perms: { Transactions: "CRUD", Settlements: "CRUD", Payments: "CRUD", Customers: "CRUD", Locations: "CRUD", Terminals: "CRUD", Users: "CRUD", Reports: "CRUD" } },
  { role: "Support Engineer", perms: { Transactions: "RU", Settlements: "R", Payments: "R", Customers: "R", Locations: "RU", Terminals: "RU", Users: "R", Reports: "R" } },
  { role: "Read Only", perms: { Transactions: "R", Settlements: "R", Payments: "R", Customers: "R", Locations: "R", Terminals: "R", Users: "-", Reports: "R" } },
];

export const feedback = [
  { user: "amara.okafor@dojo.tech", message: "The settlement filters are really helpful — could we add CSV export?", performedAt: "2026-07-26 15:20" },
  { user: "ben.whitfield@dojo.tech", message: "Transaction search feels fast now, thanks!", performedAt: "2026-07-25 11:03" },
  { user: "diego.alvarez@dojo.tech", message: "Would love keyboard shortcuts on the tables.", performedAt: "2026-07-24 09:47" },
];
