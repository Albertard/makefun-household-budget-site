// HomeLedger charts — small dependency-free SVG charts drawn from the
// household's own figures. No canvas, no libraries, no network calls.

import { fmtUSD } from "./data.js";

function esc(text) {
  return String(text).replace(/[&<>"]/g, (ch) => `&#${ch.charCodeAt(0)};`);
}

// Donut of spending by category.
// slices: [{ label, value, colour }]
export function spendingDonut(slices, size = 190) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  const mid = size / 2;
  const outer = mid - 14;
  const inner = outer - 30;
  if (total <= 0) {
    return (
      `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="No spending yet">` +
      `<circle cx="${mid}" cy="${mid}" r="${outer}" fill="none" stroke="#e6ece6" stroke-width="30"/>` +
      `<text x="${mid}" y="${mid}" text-anchor="middle" fill="#5d6f63" font-size="14">No spending</text></svg>`
    );
  }
  const point = (radius, angle) => [mid + radius * Math.cos(angle), mid + radius * Math.sin(angle)];
  let cursor = -Math.PI / 2;
  const arcs = [];
  for (const slice of slices) {
    const share = slice.value / total;
    const start = cursor;
    const end = cursor + share * Math.PI * 2;
    cursor = end;
    const big = share > 0.5 ? 1 : 0;
    const [x0, y0] = point(outer, start);
    const [x1, y1] = point(outer, end);
    const [xi1, yi1] = point(inner, end);
    const [xi0, yi0] = point(inner, start);
    arcs.push(
      `<path d="M ${x0.toFixed(1)} ${y0.toFixed(1)} A ${outer} ${outer} 0 ${big} 1 ${x1.toFixed(1)} ${y1.toFixed(1)} ` +
        `L ${xi1.toFixed(1)} ${yi1.toFixed(1)} A ${inner} ${inner} 0 ${big} 0 ${xi0.toFixed(1)} ${yi0.toFixed(1)} Z" ` +
        `fill="${slice.colour}"><title>${esc(slice.label)}: ${fmtUSD(slice.value)}</title></path>`,
    );
  }
  return (
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, ${fmtUSD(total)} in total">` +
    arcs.join("") +
    `<text x="${mid}" y="${mid - 4}" text-anchor="middle" font-size="13" fill="#5d6f63">Spent</text>` +
    `<text x="${mid}" y="${mid + 16}" text-anchor="middle" font-size="16" font-weight="800" fill="#1d2b22">${fmtUSD(total)}</text></svg>`
  );
}

// Paired income-vs-spending columns for up to six months.
// rows: [{ label, income, expense }]
export function incomeSpendingBars(rows) {
  const peak = Math.max(1, ...rows.flatMap((row) => [row.income, row.expense]));
  const columns = rows
    .map((row) => {
      const incomeHeight = Math.max(4, Math.round((row.income / peak) * 120));
      const spentHeight = Math.max(4, Math.round((row.expense / peak) * 120));
      return `<div class="col">
        <span class="value">${fmtUSD(row.income)}</span>
        <span class="stick income" style="height:${incomeHeight}px" title="Income ${fmtUSD(row.income)}"></span>
        <span class="stick expense" style="height:${spentHeight}px" title="Spending ${fmtUSD(row.expense)}"></span>
        <span class="value">${fmtUSD(row.expense)}</span>
        <span class="month">${esc(row.label)}</span>
      </div>`;
    })
    .join("");
  return `<div class="bars" role="img" aria-label="Income and spending by month">${columns}</div>
  <p class="small"><span style="color:#15803d">■</span> Income &nbsp; <span style="color:#d97706">■</span> Spending</p>`;
}
