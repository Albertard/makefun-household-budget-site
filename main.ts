// HomeLedger — a household budget site, handed in as a make.fun entry.
//
// The site itself is app/: plain static files (HTML, CSS and ES modules,
// no build step, no network). A household opens app/index.html in a
// browser, on a desktop or a phone, and tracks income, spending, budgets
// and savings goals, with the figures kept in localStorage.
//
// This program (Node 22, standard library only) hands the site in. It
// copies app/ and screenshots/ from beside this file into the output
// directory and writes /output/dossier.json with the vendored make.fun
// library — the summary the judge reads (screenshots, first-load files
// and bytes, and the source). Leave vendor/makefun-frontend.ts alone:
// the scorer rebuilds dossier.json with its own copy and wants a
// byte-for-byte match.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function fail(message) {
  throw new Error(message);
}

function listShots() {
  if (!existsSync(join(here, "screenshots"))) return [];
  return readdirSync(join(here, "screenshots")).filter((name) =>
    /\.(png|jpe?g)$/i.test(name),
  );
}

// Fail loudly instead of handing in half a site: the gate refuses an
// entry with no app/index.html or with the wrong number of screenshots.
if (!existsSync(join(here, "app", "index.html"))) {
  fail("app/index.html is missing");
}
const shots = listShots();
if (shots.length < 3 || shots.length > 4) {
  fail(`expected 3 or 4 screenshots, found ${shots.length}`);
}

mkdirSync(outDir, { recursive: true });
cpSync(join(here, "app"), join(outDir, "app"), { recursive: true });
mkdirSync(join(outDir, "screenshots"), { recursive: true });
cpSync(join(here, "screenshots"), join(outDir, "screenshots"), {
  recursive: true,
});

writeFileSync(
  join(outDir, "dossier.json"),
  buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);

// The dossier the judge reads must stay under the 1.5 MiB cap; fail
// loudly instead of handing in an oversized one.
const DOSSIER_MAX_BYTES = 1572864;
const dossierPath = join(outDir, "dossier.json");
const dossierBytes = statSync(dossierPath).size;
if (dossierBytes > DOSSIER_MAX_BYTES) {
  fail(`dossier.json is ${dossierBytes} bytes, over the ${DOSSIER_MAX_BYTES} byte cap`);
}

function dirBytes(dir) {
  return readdirSync(dir, { withFileTypes: true }).reduce((total, entry) => {
    const path = join(dir, entry.name);
    return total + (entry.isDirectory() ? dirBytes(path) : statSync(path).size);
  }, 0);
}
const totalBytes = dirBytes(outDir);

console.log(
  `HomeLedger handed in: ${readdirSync(join(outDir, "app")).length} entries in app/, ` +
    `${shots.length} screenshots (${shots.join(", ")}), dossier.json ${dossierBytes} bytes, ` +
    `${totalBytes} bytes written to ${outDir}`,
);
