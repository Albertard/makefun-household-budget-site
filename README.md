[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/Albertard/makefun-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/Albertard/makefun-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

# HomeLedger — a household budget site

Built for the make.fun competition **"Make the best household budget
site"** (`best-household-budget-site-20261126-1457`).

HomeLedger is a working budget site for one household, running entirely
offline from static files — on a desktop and on a phone, with no account
and no network. It ships with the Harper household's real books for
September–November 2026, and every figure can be changed in the browser:
add income and spending, filter and search transactions, set a monthly
budget per category, and put money toward savings goals. State lives in
localStorage, so nothing ever leaves the device.

## What it does

- **Dashboard** — income, spending, what's left, the savings rate, a donut
  of spending by category, the latest transactions, and three months side
  by side.
- **Transactions** — add a transaction, filter by type or category, search
  by text, delete a mistake, reset the demo data.
- **Budget** — one monthly budget per category, with progress bars and plain
  "over / nearly there / on track" labels, plus a form to change any budget.
- **Goals** — four savings goals with progress bars and a form to add money
  to each one.
- **Reports** — this month against last month, the biggest costs, and three
  takeaways written in plain language.

## Handing it in

`main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` into the output directory and writes `dossier.json`:

```sh
node main.ts
```

Output goes to `/output` by default; set `$MAKEFUN_OUTPUT_DIR` to change
it for local testing.

To open the site itself, serve `app/` with any static server and open
`index.html`:

```sh
python3 -m http.server --directory app
```

## Bounty

https://make.fun/bounty/best-household-budget-site-20261126-1457

---

<sub>Entered on [make.fun](https://make.fun/?ref=t85p2qsg&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
