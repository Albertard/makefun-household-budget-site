// HomeLedger app — hash router and the wiring that makes every control work.
//
//   #/                Dashboard
//   #/transactions    Add, filter, search and delete transactions
//   #/budget          Monthly budgets per category
//   #/goals           Savings goals and contributions
//   #/reports         Month-on-month comparison and takeaways
//
// The month picker at the top switches the month every page shows. All state
// lives in data.js and is written to localStorage on every change.
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import {
  MONTHS,
  fmtUSD,
  loadBooks,
  resetBooks,
  saveBooks,
} from "./data.js";
import {
  pageBudget,
  pageDashboard,
  pageGoals,
  pageMissing,
  pageReports,
  pageTransactions,
} from "./views.js";

const root = document.getElementById("app");
const monthSelect = document.getElementById("monthSelect");

let books = loadBooks();
let currentMonth = MONTHS[MONTHS.length - 1].id;

monthSelect.innerHTML = MONTHS.map(
  (m) => `<option value="${m.id}">${m.name}</option>`,
).join("");
monthSelect.value = currentMonth;
monthSelect.addEventListener("change", () => {
  currentMonth = monthSelect.value;
  showPage();
});

function dateFor(month) {
  const day = Math.min(new Date().getDate(), 28);
  return `${month}-${String(day).padStart(2, "0")}`;
}

function freshId(prefix) {
  const stamp = Date.now().toString(36);
  const salt = Math.floor(Math.random() * 1296).toString(36);
  return `${prefix}${stamp}${salt}`;
}

function showPage() {
  window.__shotReady = false;
  const hash = location.hash || "#/";
  const route = hash.replace(/^#\/?/, "").split("/")[0] || "dashboard";
  const pages = {
    dashboard: () => pageDashboard(books, currentMonth),
    transactions: () => pageTransactions(books, currentMonth),
    budget: () => pageBudget(books, currentMonth),
    goals: () => pageGoals(books),
    reports: () => pageReports(books, currentMonth),
  };
  const titles = {
    dashboard: "HomeLedger — Household Budget",
    transactions: "Transactions | HomeLedger",
    budget: "Budget | HomeLedger",
    goals: "Savings goals | HomeLedger",
    reports: "Reports | HomeLedger",
  };
  const render = pages[route];
  root.innerHTML = render ? render() : pageMissing();
  document.title = titles[route] ?? "Not found | HomeLedger";
  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === route);
  });
  bindControls(route);
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function bindControls(route) {
  if (route === "transactions") bindTransactions();
  else if (route === "budget") bindBudget();
  else if (route === "goals") bindGoals();
}

function bindTransactions() {
  const form = document.getElementById("addForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const amount = Number(fields.get("amount"));
    const note = String(fields.get("note") || "").trim();
    if (!note || !(amount > 0)) return;
    books.transactions.push({
      id: freshId("u"),
      month: currentMonth,
      date: dateFor(currentMonth),
      type: fields.get("type") === "income" ? "income" : "expense",
      category: String(fields.get("category")),
      note,
      amount: Math.round(amount * 100) / 100,
    });
    saveBooks(books);
    showPage();
  });

  const typeBox = document.getElementById("filterType");
  const catBox = document.getElementById("filterCat");
  const textBox = document.getElementById("filterText");
  const counter = document.getElementById("txCount");
  const applyFilters = () => {
    const type = typeBox.value;
    const cat = catBox.value;
    const text = textBox.value.trim().toLowerCase();
    let visible = 0;
    document.querySelectorAll("#txTable tbody tr").forEach((row) => {
      const okType = type === "all" || row.dataset.type === type;
      const okCat = cat === "all" || row.dataset.cat === cat;
      const okText = !text || row.dataset.note.includes(text);
      const show = okType && okCat && okText;
      row.style.display = show ? "" : "none";
      if (show) visible += 1;
    });
    counter.textContent = `${visible} shown.`;
  };
  typeBox.addEventListener("change", applyFilters);
  catBox.addEventListener("change", applyFilters);
  textBox.addEventListener("input", applyFilters);

  document.querySelectorAll("[data-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.delete;
      const row = books.transactions.find((tx) => tx.id === id);
      if (!row) return;
      if (!window.confirm(`Delete “${row.note}” (${fmtUSD(row.amount)})?`)) return;
      books.transactions = books.transactions.filter((tx) => tx.id !== id);
      saveBooks(books);
      showPage();
    });
  });

  document.getElementById("resetDemo").addEventListener("click", () => {
    if (!window.confirm("Reset all figures to the original September–November demo data?")) return;
    books = resetBooks();
    showPage();
  });
}

function bindBudget() {
  const form = document.getElementById("budgetForm");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fields = new FormData(form);
    const amount = Number(fields.get("amount"));
    if (!(amount >= 0)) return;
    books.budgets[String(fields.get("category"))] = Math.round(amount * 100) / 100;
    saveBooks(books);
    showPage();
  });
}

function bindGoals() {
  document.querySelectorAll("form[data-goal]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const fields = new FormData(form);
      const amount = Number(fields.get("amount"));
      if (!(amount > 0)) return;
      const goal = books.goals.find((g) => g.id === form.dataset.goal);
      if (!goal) return;
      goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      saveBooks(books);
      showPage();
    });
  });
}

window.addEventListener("hashchange", showPage);
showPage();
