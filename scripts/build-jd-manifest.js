#!/usr/bin/env node
/**
 * scripts/build-jd-manifest.js
 *
 * Scans public/JD/ for *.pdf files and writes public/JD/manifest.json.
 * Run any time you add or remove a PDF:
 *   node scripts/build-jd-manifest.js
 *
 * Each entry:
 *   { id, title, slug, dept, type, location, pdf }
 */

import fs   from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const JD_DIR       = path.join(__dirname, "../public/JD");
const MANIFEST_OUT = path.join(JD_DIR, "manifest.json");

// ── Helpers ────────────────────────────────────────────────────────────────

/** "my-filename-slug" from any string */
function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[—–]/g, "-")          // em/en dash → hyphen
    .replace(/[^a-z0-9\s-]/g, "")  // strip special chars
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/**
 * Infer a department from the job title.
 * Order matters — more specific patterns first.
 */
function inferDept(title) {
  const t = title.toLowerCase();
  if (/qa|quality assurance|test/.test(t))                    return "QA";
  if (/security|compliance/.test(t))                          return "Security";
  if (/devops|infrastructure|sre|platform/.test(t))           return "DevOps";
  if (/android|ios|flutter|mobile|react native/.test(t))      return "Mobile";
  if (/designer|design|ux|ui/.test(t))                        return "Design";
  if (/product manager|product owner/.test(t))                return "Product";
  if (/data engineer|data scientist|ml|machine learning|ai/.test(t)) return "AI & Data";
  if (/blockchain|solana|smart contract|web3|defi|dao|nft/.test(t))  return "Blockchain";
  if (/manager|director|cto|chief|head of|engineering lead/.test(t)) return "Management";
  if (/support/.test(t))                                       return "Support";
  return "Engineering";
}

/** Strip the " — Subtitle" suffix that many filenames carry */
function cleanTitle(raw) {
  // Remove ".pdf" extension
  let t = raw.replace(/\.pdf$/i, "");
  // Remove everything after " — " (em dash) or " - " if it looks like a subtitle
  // e.g. "Senior Web3 Backend Engineer — Web3 Fintech & Payments"
  t = t.replace(/\s[—–]\s.*$/, "");
  return t.trim();
}

// ── Main ───────────────────────────────────────────────────────────────────

const files = fs.readdirSync(JD_DIR)
  .filter(f => f.toLowerCase().endsWith(".pdf"))
  .sort();

const jobs = files.map((filename, idx) => {
  const title = cleanTitle(filename);
  return {
    id:       idx + 1,
    title,
    slug:     toSlug(title),
    dept:     inferDept(title),
    type:     "Full-time",
    location: "Warsaw, PL (Hybrid)",
    pdf:      `/JD/${filename}`,
  };
});

fs.writeFileSync(MANIFEST_OUT, JSON.stringify(jobs, null, 2), "utf8");
console.log(`✅  manifest.json written — ${jobs.length} role(s)`);
jobs.forEach(j => console.log(`   • [${j.dept}] ${j.title}`));
