// HomeLedger — the Harper household's books.
//
// Three months of figures ship with the site (September, October and
// November 2026). Anything the household changes in the browser — a new
// transaction, a changed budget, money added to a goal — is written to
// localStorage under "homeledger-v2", so the books survive a reload and
// never leave this device. "Reset demo data" on the Transactions page
// restores the figures below.

export const CATEGORIES = [
  { id: "housing", name: "Housing", colour: "#14532d" },
  { id: "groceries", name: "Groceries", colour: "#15803d" },
  { id: "transport", name: "Transport", colour: "#1d4ed8" },
  { id: "utilities", name: "Utilities", colour: "#0e7490" },
  { id: "dining", name: "Dining out", colour: "#d97706" },
  { id: "entertainment", name: "Entertainment", colour: "#7c3aed" },
  { id: "health", name: "Health", colour: "#be185d" },
  { id: "kids", name: "Kids & school", colour: "#b45309" },
  { id: "household", name: "Household", colour: "#475569" },
  { id: "other", name: "Other", colour: "#94a3b8" },
];

export const MONTHS = [
  { id: "2026-09", name: "September 2026" },
  { id: "2026-10", name: "October 2026" },
  { id: "2026-11", name: "November 2026" },
];

// One row of the books: id, date, income or expense, category, what it was,
// amount in dollars. The month is taken from the date.
function T(id, date, kind, cat, what, amount) {
  return { id, month: date.slice(0, 7), date, type: kind, category: cat, note: what, amount };
}

const seedTransactions = [
  // November 2026 — the month the site opens on.
  T("n01", "2026-11-01", "income", "other", "Maya Harper — salary (school district)", 3420),
  T("n02", "2026-11-01", "income", "other", "Dan Harper — salary (workshop)", 2180),
  T("n03", "2026-11-01", "income", "other", "Garage sale — old bikes", 240),
  T("n04", "2026-11-02", "expense", "housing", "Mortgage — First County Bank", 1450),
  T("n05", "2026-11-03", "expense", "groceries", "GreenMart weekly shop", 148.6),
  T("n06", "2026-11-05", "expense", "utilities", "Electric bill — City Power", 132.4),
  T("n07", "2026-11-06", "expense", "transport", "Fuel — Route 9 station", 54.2),
  T("n08", "2026-11-07", "expense", "groceries", "GreenMart weekly shop", 161.35),
  T("n09", "2026-11-08", "expense", "dining", "Pizza night — Luigi’s", 38.5),
  T("n10", "2026-11-09", "expense", "kids", "Leo — school trip deposit", 85),
  T("n11", "2026-11-10", "expense", "utilities", "Water + internet bundle", 96.75),
  T("n12", "2026-11-12", "expense", "transport", "Bus passes — Maya & Leo", 72),
  T("n13", "2026-11-13", "expense", "groceries", "GreenMart weekly shop", 139.9),
  T("n14", "2026-11-14", "expense", "entertainment", "Cinema — family film night", 46),
  T("n15", "2026-11-15", "expense", "health", "Pharmacy — flu jabs x2", 58),
  T("n16", "2026-11-16", "expense", "household", "Hardware store — faucet washers", 22.4),
  T("n17", "2026-11-18", "expense", "groceries", "GreenMart weekly shop + Thanksgiving list", 174.2),
  T("n18", "2026-11-19", "expense", "transport", "Fuel — Route 9 station", 48.9),
  T("n19", "2026-11-20", "expense", "dining", "Takeaway — Thai Garden", 42.75),
  T("n20", "2026-11-21", "expense", "kids", "Sofia — dance shoes", 64),
  T("n21", "2026-11-22", "expense", "entertainment", "Streaming — November", 15.99),
  T("n22", "2026-11-23", "expense", "groceries", "Corner market top-up", 36.8),
  T("n23", "2026-11-24", "expense", "health", "Dentist check-up — Dan", 45),
  T("n24", "2026-11-25", "expense", "household", "Laundry detergent + cleaning", 31.5),
  // October 2026.
  T("o01", "2026-10-01", "income", "other", "Maya Harper — salary (school district)", 3420),
  T("o02", "2026-10-01", "income", "other", "Dan Harper — salary (workshop)", 2180),
  T("o03", "2026-10-02", "expense", "housing", "Mortgage — First County Bank", 1450),
  T("o04", "2026-10-04", "expense", "groceries", "GreenMart weekly shop", 152.1),
  T("o05", "2026-10-06", "expense", "utilities", "Electric bill — City Power", 118.9),
  T("o06", "2026-10-08", "expense", "transport", "Fuel — Route 9 station", 61.3),
  T("o07", "2026-10-11", "expense", "groceries", "GreenMart weekly shop", 144.7),
  T("o08", "2026-10-12", "expense", "kids", "Leo — football boots", 72),
  T("o09", "2026-10-14", "expense", "dining", "Birthday dinner — Grandma Rosa", 86.4),
  T("o10", "2026-10-15", "expense", "utilities", "Water + internet bundle", 96.75),
  T("o11", "2026-10-18", "expense", "groceries", "GreenMart weekly shop", 158.2),
  T("o12", "2026-10-20", "expense", "transport", "Car service — oil + filters", 189),
  T("o13", "2026-10-22", "expense", "entertainment", "Cinema — family film night", 44),
  T("o14", "2026-10-25", "expense", "groceries", "GreenMart weekly shop", 149.6),
  T("o15", "2026-10-27", "expense", "health", "Pharmacy — vitamins", 34.5),
  T("o16", "2026-10-29", "expense", "household", "Garden — autumn bulbs", 28.9),
  // September 2026.
  T("s01", "2026-09-01", "income", "other", "Maya Harper — salary (school district)", 3420),
  T("s02", "2026-09-01", "income", "other", "Dan Harper — salary (workshop)", 2180),
  T("s03", "2026-09-02", "expense", "housing", "Mortgage — First County Bank", 1450),
  T("s04", "2026-09-05", "expense", "groceries", "GreenMart weekly shop", 146.8),
  T("s05", "2026-09-07", "expense", "utilities", "Electric bill — City Power", 104.2),
  T("s06", "2026-09-09", "expense", "kids", "School books — Leo & Sofia", 118),
  T("s07", "2026-09-12", "expense", "groceries", "GreenMart weekly shop", 151.3),
  T("s08", "2026-09-14", "expense", "transport", "Fuel — Route 9 station", 57.6),
  T("s09", "2026-09-16", "expense", "dining", "Takeaway — Thai Garden", 39.9),
  T("s10", "2026-09-19", "expense", "groceries", "GreenMart weekly shop", 143.5),
  T("s11", "2026-09-21", "expense", "entertainment", "Zoo tickets — family day", 68),
  T("s12", "2026-09-24", "expense", "household", "Bedsheets + towels", 54.2),
  T("s13", "2026-09-26", "expense", "groceries", "GreenMart weekly shop", 147.9),
  T("s14", "2026-09-28", "expense", "health", "Optician — Sofia glasses", 89),
];

// Monthly budget per category, in dollars.
const seedBudgets = {
  housing: 1450,
  groceries: 650,
  transport: 260,
  utilities: 250,
  dining: 160,
  entertainment: 120,
  health: 120,
  kids: 200,
  household: 100,
  other: 50,
};

const seedGoals = [
  { id: "g1", name: "Emergency fund — 3 months", target: 9000, saved: 5400, note: "$300 a month, auto-transfer on payday" },
  { id: "g2", name: "Summer holiday — Lake District", target: 2400, saved: 1450, note: "Book the cottage by March" },
  { id: "g3", name: "New washing machine", target: 650, saved: 520, note: "Old one leaks — replace before winter" },
  { id: "g4", name: "Leo’s bike fund", target: 320, saved: 180, note: "Leo saves $10 a week from pocket money" },
];

const STORAGE_KEY = "homeledger-v2";

function freshBooks() {
  return {
    transactions: seedTransactions.map((row) => ({ ...row })),
    budgets: { ...seedBudgets },
    goals: seedGoals.map((goal) => ({ ...goal })),
  };
}

export function loadBooks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshBooks();
    const parsed = JSON.parse(raw);
    const ok =
      parsed &&
      Array.isArray(parsed.transactions) &&
      parsed.budgets &&
      typeof parsed.budgets === "object" &&
      Array.isArray(parsed.goals);
    return ok ? parsed : freshBooks();
  } catch {
    return freshBooks();
  }
}

export function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

export function resetBooks() {
  localStorage.removeItem(STORAGE_KEY);
  return freshBooks();
}

// "$5,840.00" — always two decimals, US grouping.
export function fmtUSD(n) {
  return (
    "$" +
    Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  );
}

export function totalsFor(books, monthId) {
  const rows = books.transactions.filter((row) => row.month === monthId);
  let income = 0;
  let spent = 0;
  for (const row of rows) {
    if (row.type === "income") income += row.amount;
    else spent += row.amount;
  }
  return { income, expense: spent, left: income - spent, count: rows.length };
}

export function spentByCategory(books, monthId) {
  const sums = new Map(CATEGORIES.map((cat) => [cat.id, 0]));
  for (const row of books.transactions) {
    if (row.month === monthId && row.type === "expense") {
      sums.set(row.category, (sums.get(row.category) ?? 0) + row.amount);
    }
  }
  return sums;
}

export function categoryName(id) {
  return CATEGORIES.find((cat) => cat.id === id)?.name ?? "Other";
}

export function categoryColour(id) {
  return CATEGORIES.find((cat) => cat.id === id)?.colour ?? "#94a3b8";
}
