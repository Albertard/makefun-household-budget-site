// HomeLedger pages — one render function per page. Every value is escaped
// before it reaches the page, and every control on screen does something.

import {
  CATEGORIES,
  MONTHS,
  categoryColour,
  categoryName,
  fmtUSD,
  spentByCategory,
  totalsFor,
} from "./data.js";
import { incomeSpendingBars, spendingDonut } from "./charts.js";

function esc(text) {
  return String(text).replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

function monthName(id) {
  return MONTHS.find((m) => m.id === id)?.name ?? id;
}

function saveRate(totals) {
  if (totals.income <= 0) return 0;
  return Math.round(((totals.income - totals.expense) / totals.income) * 100);
}

function monthBarRows(books) {
  return MONTHS.map((m) => {
    const t = totalsFor(books, m.id);
    return { label: m.name.split(" ")[0], income: t.income, expense: t.expense };
  });
}

export function pageDashboard(books, monthId) {
  const t = totalsFor(books, monthId);
  const byCat = spentByCategory(books, monthId);
  const slices = CATEGORIES.map((cat) => ({
    label: cat.name,
    value: byCat.get(cat.id) ?? 0,
    colour: cat.colour,
  })).filter((slice) => slice.value > 0);
  const biggest = [...slices].sort((a, b) => b.value - a.value).slice(0, 5);
  const latest = books.transactions
    .filter((row) => row.month === monthId)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 6);
  const overBudget = CATEGORIES.filter(
    (cat) => (byCat.get(cat.id) ?? 0) > (books.budgets[cat.id] ?? 0),
  ).map((cat) => cat.name);
  const rate = saveRate(t);

  const alert =
    overBudget.length > 0
      ? `<section class="tip"><h2>Heads up</h2><p>${overBudget.map(esc).join(", ")} ${
          overBudget.length === 1 ? "is" : "are"
        } over budget this month. The <a href="#/budget">Budget</a> page has the exact figures.</p></section>`
      : `<section class="callout"><h2>On track</h2><p>Every category is inside its budget this month. Nothing is over.</p></section>`;

  return `<h1>Good evening, Harper household</h1>
<p class="lede">Here is ${esc(monthName(monthId))} at a glance — what came in, what went out, and what is left for the goals.</p>

<section class="grid-4" aria-label="Month summary">
  <div class="card tile"><p class="label">Income</p><p class="amount good">${fmtUSD(t.income)}</p><p class="note">2 salaries + garage sale</p></div>
  <div class="card tile"><p class="label">Spending</p><p class="amount bad">${fmtUSD(t.expense)}</p><p class="note">${t.count} transactions this month</p></div>
  <div class="card tile accent"><p class="label">Left over</p><p class="amount">${fmtUSD(t.left)}</p><p class="note">${rate}% of income saved or unspent</p></div>
  <div class="card tile"><p class="label">Savings rate</p><p class="amount">${rate}%</p><p class="note">${
    rate >= 20 ? "Above the 20% household rule — well done." : "Below the 20% household rule."
  }</p></div>
</section>

${alert}

<section class="grid-2">
  <div class="card">
    <h2>Where the money went</h2>
    <div class="chart-wrap">
      ${spendingDonut(slices)}
      <ul class="legend">
        ${biggest
          .map(
            (slice) =>
              `<li><span class="swatch" style="background:${slice.colour}"></span>${esc(slice.label)}<span class="pct">${fmtUSD(slice.value)}</span></li>`,
          )
          .join("")}
      </ul>
    </div>
    <p class="small">Housing is the biggest slice, as usual — mortgage first, everything else after.</p>
  </div>
  <div class="card">
    <h2>Latest transactions</h2>
    <table>
      <thead><tr><th>Date</th><th>What</th><th class="num">Amount</th></tr></thead>
      <tbody>
        ${latest
          .map(
            (row) =>
              `<tr><td>${esc(row.date.slice(5))}</td><td>${esc(row.note)}</td><td class="num ${row.type === "income" ? "pos" : "neg"}">${row.type === "income" ? "+" : "−"}${fmtUSD(row.amount)}</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>
    <p><a href="#/transactions">See all ${t.count} transactions →</a></p>
  </div>
</section>

<section class="card">
  <h2>Three months side by side</h2>
  ${incomeSpendingBars(monthBarRows(books))}
  <p class="small">November is the strongest month so far: the garage sale added $240 and grocery spending fell $44 on October.</p>
</section>`;
}

export function pageTransactions(books, monthId) {
  const rows = books.transactions
    .filter((row) => row.month === monthId)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const t = totalsFor(books, monthId);
  const options = CATEGORIES.map(
    (cat) => `<option value="${cat.id}">${esc(cat.name)}</option>`,
  ).join("");
  return `<h1>Transactions</h1>
<p class="lede">${esc(monthName(monthId))}: ${t.count} entries, ${fmtUSD(t.income)} in and ${fmtUSD(t.expense)} out. Add a new one below, filter the list, or delete a mistake.</p>

<section class="card">
  <h2>Add a transaction</h2>
  <form class="add-form" id="addForm">
    <div class="field"><label for="fNote">What was it?</label><input id="fNote" name="note" required maxlength="80" placeholder="e.g. GreenMart weekly shop"></div>
    <div class="field"><label for="fAmount">Amount ($)</label><input id="fAmount" name="amount" type="number" min="0.01" step="0.01" required placeholder="0.00"></div>
    <div class="field"><label for="fType">Type</label><select id="fType" name="type"><option value="expense">Spending</option><option value="income">Income</option></select></div>
    <div class="field"><label for="fCat">Category</label><select id="fCat" name="category">${options}</select></div>
    <div><button type="submit">Add it</button></div>
  </form>
  <p class="hint">Saved on this device straight away. Use the month picker at the top to add to another month.</p>
</section>

<section class="card">
  <h2>All transactions</h2>
  <div class="filters">
    <div class="field"><label for="filterType">Show</label><select id="filterType"><option value="all">Everything</option><option value="income">Income only</option><option value="expense">Spending only</option></select></div>
    <div class="field"><label for="filterCat">Category</label><select id="filterCat"><option value="all">All categories</option>${options}</select></div>
    <div class="field"><label for="filterText">Search</label><input id="filterText" type="search" placeholder="e.g. GreenMart"></div>
  </div>
  <table id="txTable">
    <thead><tr><th>Date</th><th>What</th><th>Category</th><th class="num">Amount</th><th><span class="hide-phone">Delete</span></th></tr></thead>
    <tbody>
      ${rows
        .map(
          (row) => `<tr data-type="${row.type}" data-cat="${row.category}" data-note="${esc(row.note.toLowerCase())}">
        <td>${esc(row.date)}</td><td>${esc(row.note)}</td>
        <td><span class="pill" style="background:${categoryColour(row.category)}22;color:${categoryColour(row.category)}">${esc(categoryName(row.category))}</span></td>
        <td class="num ${row.type === "income" ? "pos" : "neg"}">${row.type === "income" ? "+" : "−"}${fmtUSD(row.amount)}</td>
        <td><button class="danger" data-delete="${row.id}" aria-label="Delete ${esc(row.note)}">Delete</button></td>
      </tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <p class="hint" id="txCount">${rows.length} shown.</p>
  <p><button class="secondary" id="resetDemo">Reset demo data</button> <span class="small">Restores the original September–November figures.</span></p>
</section>`;
}

export function pageBudget(books, monthId) {
  const byCat = spentByCategory(books, monthId);
  const budgetTotal = Object.values(books.budgets).reduce((sum, v) => sum + v, 0);
  const spentTotal = [...byCat.values()].reduce((sum, v) => sum + v, 0);
  const rows = CATEGORIES.map((cat) => {
    const spent = byCat.get(cat.id) ?? 0;
    const budget = books.budgets[cat.id] ?? 0;
    const used = budget > 0 ? Math.round((spent / budget) * 100) : 0;
    const remaining = budget - spent;
    const state = used > 100 ? "over" : used >= 85 ? "warn" : "";
    const badge =
      used > 100
        ? `<span class="pill over">Over by ${fmtUSD(-remaining)}</span>`
        : used >= 85
          ? `<span class="pill warn">Nearly there</span>`
          : `<span class="pill">On track</span>`;
    return { cat, spent, budget, used, remaining, state, badge };
  });
  return `<h1>Monthly budget</h1>
<p class="lede">One budget per category for ${esc(monthName(monthId))}. Set a number, watch the bar, and the page tells you plainly when a category is over. Total budget ${fmtUSD(budgetTotal)} against ${fmtUSD(spentTotal)} spent so far.</p>

<section class="grid-2">
  <div class="card">
    <h2>Budgets vs spending</h2>
    ${rows
      .map(
        (row) => `<div class="budget-row">
      <div class="budget-head"><span>${esc(row.cat.name)}</span><span class="spent ${row.state}">${fmtUSD(row.spent)} of ${fmtUSD(row.budget)}</span></div>
      <div class="bar" role="img" aria-label="${esc(row.cat.name)}: ${row.used}% of budget used"><span class="${row.state}" style="width:${Math.min(100, row.used)}%"></span></div>
      <p class="budget-sub">${row.used}% used · ${row.remaining >= 0 ? `${fmtUSD(row.remaining)} left` : `${fmtUSD(-row.remaining)} over`} · ${row.badge}</p>
    </div>`,
      )
      .join("")}
  </div>
  <div class="card">
    <h2>Change a budget</h2>
    <p>Pick a category, type the new monthly amount, and save. The bars and the dashboard update at once.</p>
    <form id="budgetForm">
      <div class="field"><label for="bCat">Category</label><select id="bCat" name="category">${CATEGORIES.map(
        (cat) => `<option value="${cat.id}">${esc(cat.name)} — now ${fmtUSD(books.budgets[cat.id] ?? 0)}</option>`,
      ).join("")}</select></div>
      <div class="field" style="margin-top:10px"><label for="bAmount">New monthly budget ($)</label><input id="bAmount" name="amount" type="number" min="0" step="1" required placeholder="e.g. 700"></div>
      <div style="margin-top:12px"><button type="submit">Save budget</button></div>
    </form>
    <h3 style="margin-top:24px">How the budgets were set</h3>
    <p class="small">Housing is the fixed mortgage ($1,450). Groceries ($650) covers four weekly shops plus a top-up. Transport ($260) covers fuel and two bus passes. The rest are caps the family agreed in September — dining out stays under $160 so the holiday fund keeps growing.</p>
    <p class="small">Rule of thumb the family uses: housing under 30% of income, groceries under 12%, and at least 20% saved. November sits at ${saveRate(totalsFor(books, monthId))}% saved.</p>
  </div>
</section>`;
}

export function pageGoals(books) {
  const savedTotal = books.goals.reduce((sum, goal) => sum + goal.saved, 0);
  const targetTotal = books.goals.reduce((sum, goal) => sum + goal.target, 0);
  const overall = targetTotal > 0 ? Math.round((savedTotal / targetTotal) * 100) : 0;
  const novemberLeft = totalsFor(books, "2026-11").left;
  return `<h1>Savings goals</h1>
<p class="lede">Four things the household is saving for. ${fmtUSD(savedTotal)} saved toward ${fmtUSD(targetTotal)} in total — ${overall}% of the way there. Add money to a goal whenever there is spare cash at the end of the month.</p>

<section class="card">
  <h2>All goals — ${overall}% funded</h2>
  ${books.goals
    .map((goal) => {
      const pct = goal.target > 0 ? Math.round((goal.saved / goal.target) * 100) : 0;
      return `<div class="goal">
      <div class="goal-head"><span>${esc(goal.name)}</span><span>${fmtUSD(goal.saved)} of ${fmtUSD(goal.target)}</span></div>
      <div class="bar" role="img" aria-label="${esc(goal.name)}: ${pct}% funded"><span style="width:${Math.min(100, pct)}%"></span></div>
      <p class="budget-sub">${pct}% funded · ${fmtUSD(goal.target - goal.saved)} to go · ${esc(goal.note)}</p>
      <form class="goal-actions" data-goal="${goal.id}">
        <label class="small" for="add-${goal.id}" style="align-self:center">Add $</label>
        <input id="add-${goal.id}" name="amount" type="number" min="1" step="1" required placeholder="50">
        <button type="submit">Add to goal</button>
      </form>
    </div>`;
    })
    .join("")}
</section>

<section class="tip">
  <h2>How the family saves</h2>
  <p>Payday rule: $300 moves to the emergency fund the morning the salaries land, before any spending. Whatever is left over at month end is split — half to the holiday, half to the next goal in line.</p>
  <p>At November's pace (${fmtUSD(novemberLeft)} left over), the washing machine is paid off in December and the holiday fund is full by March.</p>
</section>`;
}

export function pageReports(books, monthId) {
  const t = totalsFor(books, monthId);
  const monthIndex = MONTHS.findIndex((m) => m.id === monthId);
  const prevId = monthIndex > 0 ? MONTHS[monthIndex - 1].id : null;
  const prev = prevId ? totalsFor(books, prevId) : null;
  const byCat = spentByCategory(books, monthId);
  const ranked = CATEGORIES.map((cat) => ({ cat, spent: byCat.get(cat.id) ?? 0 }))
    .filter((entry) => entry.spent > 0)
    .sort((a, b) => b.spent - a.spent);
  const change = (now, before) =>
    before === 0 ? 0 : Math.round(((now - before) / before) * 100);
  const sign = (n) => (n >= 0 ? `+${n}` : `${n}`);
  const biggest = ranked[0];
  const groceryNow = byCat.get("groceries") ?? 0;
  const groceryPrev = prevId ? (spentByCategory(books, prevId).get("groceries") ?? 0) : 0;
  const rate = saveRate(t);

  const compareCard = (label, value, before, beforeLabel) => {
    const pct = prev ? change(value, before) : null;
    const note = prev
      ? `${sign(pct)}% on ${esc(beforeLabel)} (${fmtUSD(before)})`
      : "First month on record.";
    return `<div class="card tile"><p class="label">${label}</p><p class="amount">${fmtUSD(value)}</p><p class="note">${note}</p></div>`;
  };

  return `<h1>Reports</h1>
<p class="lede">What ${esc(monthName(monthId))} actually looked like, next to ${prev ? esc(monthName(prevId)) : "the month before"}. No jargon — just the changes worth knowing about.</p>

<section class="grid-3" aria-label="Month comparison">
  ${compareCard("Income vs last month", t.income, prev?.income ?? 0, prev ? monthName(prevId) : "")}
  ${compareCard("Spending vs last month", t.expense, prev?.expense ?? 0, prev ? monthName(prevId) : "")}
  <div class="card tile"><p class="label">Left over vs last month</p><p class="amount ${t.left >= (prev?.left ?? 0) ? "good" : "bad"}">${fmtUSD(t.left)}</p><p class="note">${
    prev ? `${sign(change(t.left, prev.left))}% on ${esc(monthName(prevId))} (${fmtUSD(prev.left)})` : "First month on record."
  }</p></div>
</section>

<section class="grid-2">
  <div class="card">
    <h2>Biggest costs this month</h2>
    <table>
      <thead><tr><th>#</th><th>Category</th><th class="num">Spent</th><th class="num">Share</th></tr></thead>
      <tbody>
        ${ranked
          .map(
            (entry, i) =>
              `<tr><td>${i + 1}</td><td>${esc(entry.cat.name)}</td><td class="num">${fmtUSD(entry.spent)}</td><td class="num">${Math.round((entry.spent / Math.max(1, t.expense)) * 100)}%</td></tr>`,
          )
          .join("")}
      </tbody>
    </table>
  </div>
  <div class="card">
    <h2>Three things worth knowing</h2>
    <p><strong>1. ${esc(biggest.cat.name)} is the biggest bill.</strong> ${fmtUSD(biggest.spent)} — ${Math.round((biggest.spent / Math.max(1, t.expense)) * 100)}% of all spending. It is fixed (the mortgage), so the savings have to come from the flexible categories.</p>
    <p><strong>2. Groceries ${groceryNow <= groceryPrev ? "fell" : "rose"} ${fmtUSD(Math.abs(groceryNow - groceryPrev))} on last month.</strong> ${fmtUSD(groceryNow)} against ${fmtUSD(groceryPrev)} in ${prev ? esc(monthName(prevId)) : "the previous month"} — the Thanksgiving shop was big, but the weekly shops were smaller.</p>
    <p><strong>3. The savings rate is ${rate}%.</strong> ${rate >= 20 ? "Above the family’s 20% rule: the goals stay on schedule." : "Below the family’s 20% rule — the first place to look is dining out and entertainment."}</p>
    <p class="small">Tip: a $40-a-week grocery cap would save about $160 a month — enough to finish the washing-machine goal two months early.</p>
  </div>
</section>

<section class="card">
  <h2>Income and spending, last three months</h2>
  ${incomeSpendingBars(monthBarRows(books))}
</section>`;
}

export function pageMissing() {
  return `<h1>Page not found</h1>
<p class="lede">There is no page at this address. Try one of the sections above.</p>
<p><a href="#/">Back to the dashboard →</a></p>`;
}
