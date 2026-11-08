#!/usr/bin/env node
// Builds the assignment PDFs from the Markdown files in source/ using headless Google Chrome,
// then checks them against the assignment rules (page limits, evidence IDs, leftover TODOs).
//
//   node tools/build.mjs            -> report.pdf, owner-summary.pdf
//   node tools/build.mjs stretch    -> stretch/benchmark.pdf, stretch/usability-test.pdf
//   node tools/build.mjs all        -> everything

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CORE_IDS = ["A1", "A2", "A3", "A4", "A5", "A6", "A7", "B1", "B2", "B3", "B4", "B5", "B6", "B7", "B8"];
const REPORT_BODY_MAX_PAGES = 6;
const EVIDENCE_LOG_MARKER = "<!-- EVIDENCE_LOG -->";

const DOCS = {
  core: [
    { src: "source/report.md", out: "report.pdf", title: "Website Field Study", kind: "report" },
    { src: "source/owner-summary.md", out: "owner-summary.pdf", title: "Website review", kind: "owner" },
  ],
  stretch: [
    { src: "source/benchmark.md", out: "stretch/benchmark.pdf", title: "Benchmark comparison", kind: "stretch" },
    { src: "source/usability-test.md", out: "stretch/usability-test.pdf", title: "Usability test", kind: "stretch" },
  ],
};

const warnings = [];
const warn = (msg) => warnings.push(msg);

function evidenceFiles() {
  const dir = join(ROOT, "evidence");
  return existsSync(dir) ? readdirSync(dir).filter((f) => !f.startsWith(".")) : [];
}

// Reads the evidence log, sorts its rows by ID (A1, A2 ... B8, S1 ...) and checks every row's file exists.
function evidenceLogTable() {
  const lines = readFileSync(join(ROOT, "source/evidence-log.md"), "utf8").split("\n").filter((l) => l.startsWith("|"));
  const [header, separator, ...rows] = lines;
  const cell = (row, i) => row.split("|")[i + 1]?.trim() ?? "";
  rows.sort((a, b) => cell(a, 0).localeCompare(cell(b, 0), "en", { numeric: true }) || cell(a, 1).localeCompare(cell(b, 1)));

  const logged = new Set();
  for (const row of rows) {
    const file = cell(row, 1).replace(/`/g, "");
    logged.add(file.replace(/^evidence\//, ""));
    if (!existsSync(join(ROOT, file))) warn(`Evidence log lists ${file}, but that file does not exist.`);
    if (!cell(row, 2)) warn(`Evidence log row for ${file} has no "What it shows" text.`);
    if (!cell(row, 4)) warn(`Evidence log row for ${file} has no page address.`);
  }
  for (const f of evidenceFiles()) {
    if (!logged.has(f)) warn(`evidence/${f} is not listed in source/evidence-log.md.`);
  }
  return [header, separator, ...rows].join("\n");
}

function toHtml(markdown, title) {
  const css = readFileSync(join(ROOT, "tools/print.css"), "utf8");
  const body = marked.parse(markdown, { gfm: true, breaks: true })
    .replace(/\[\[TODO:?\s*([^\]]*)\]\]/g, (_, text) => `<mark class="todo">TODO${text ? `: ${text}` : ""}</mark>`);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${title}</title>
<base href="${pathToFileURL(ROOT).href}/">
<style>${css}</style>
</head>
<body>
${body}
</body>
</html>`;
}

function printPdf(htmlPath, pdfPath) {
  const profile = mkdtempSync(join(tmpdir(), "fieldstudy-chrome-"));
  try {
    execFileSync(CHROME, [
      "--headless=new",
      "--disable-gpu",
      "--no-first-run",
      "--allow-file-access-from-files",
      `--user-data-dir=${profile}`,
      "--no-pdf-header-footer",
      "--print-to-pdf-no-header",
      `--print-to-pdf=${pdfPath}`,
      pathToFileURL(htmlPath).href,
    ], { stdio: ["ignore", "ignore", "pipe"], timeout: 90_000 });
  } finally {
    rmSync(profile, { recursive: true, force: true });
  }
}

function pageCount(pdfPath) {
  const info = execFileSync("pdfinfo", [pdfPath], { encoding: "utf8" });
  return Number(/^Pages:\s+(\d+)/m.exec(info)?.[1] ?? 0);
}

function pageText(pdfPath, page) {
  return execFileSync("pdftotext", ["-f", String(page), "-l", String(page), pdfPath, "-"], { encoding: "utf8" });
}

function hasPoppler() {
  try {
    execFileSync("pdfinfo", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function build(doc) {
  const srcPath = join(ROOT, doc.src);
  if (!existsSync(srcPath)) {
    warn(`${doc.src} not found, skipped.`);
    return;
  }
  let markdown = readFileSync(srcPath, "utf8");

  if (doc.kind === "report") {
    markdown = markdown.replace(EVIDENCE_LOG_MARKER, evidenceLogTable());
    for (const id of CORE_IDS) {
      if (!markdown.includes(`[${id}]`)) warn(`report.md never cites [${id}].`);
      if (!evidenceFiles().some((f) => f.startsWith(`${id}-`))) warn(`No evidence file for ${id} (expected evidence/${id}-....png).`);
    }
  }

  const todos = (markdown.match(/\[\[TODO/g) || []).length;
  if (todos) warn(`${doc.src} still has ${todos} TODO placeholder(s).`);

  const htmlPath = join(ROOT, "build", doc.out.replace(/\.pdf$/, ".html"));
  const pdfPath = join(ROOT, doc.out);
  mkdirSync(dirname(htmlPath), { recursive: true });
  mkdirSync(dirname(pdfPath), { recursive: true });
  writeFileSync(htmlPath, toHtml(markdown, doc.title));
  printPdf(htmlPath, pdfPath);

  let summary = "";
  if (hasPoppler()) {
    const pages = pageCount(pdfPath);
    summary = `${pages} page(s)`;
    if (doc.kind === "owner" && pages > 1) warn(`owner-summary.pdf is ${pages} pages; it must be one page.`);
    if (doc.kind === "report") {
      let appendixPage = 0;
      for (let p = 1; p <= pages && !appendixPage; p++) {
        if (/Appendix A/.test(pageText(pdfPath, p))) appendixPage = p;
      }
      const bodyPages = appendixPage ? appendixPage - 1 : pages;
      summary = `${bodyPages} body page(s) + appendix`;
      if (bodyPages > REPORT_BODY_MAX_PAGES) {
        warn(`report.pdf body is ${bodyPages} pages; the limit is ${REPORT_BODY_MAX_PAGES} (plus the evidence-log appendix).`);
      }
    }
  }
  console.log(`✔ ${doc.out}${summary ? `  (${summary})` : ""}`);
}

const target = process.argv[2] || "core";
const docs = target === "all" ? [...DOCS.core, ...DOCS.stretch] : DOCS[target];
if (!docs) {
  console.error(`Unknown target "${target}". Use: core, stretch or all.`);
  process.exit(1);
}
if (!existsSync(CHROME)) {
  console.error(`Google Chrome not found at ${CHROME}. Set CHROME_PATH to its executable.`);
  process.exit(1);
}

docs.forEach(build);

if (warnings.length) {
  console.log(`\n${warnings.length} thing(s) to check:`);
  for (const w of warnings) console.log(`  • ${w}`);
} else {
  console.log("\nNo problems found.");
}
