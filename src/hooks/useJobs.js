/**
 * useJobs — reads the JD folder at build/HMR time via import.meta.glob.
 *
 * How it works:
 *   Vite's import.meta.glob scans /public/JD/*.pdf at compile time (and
 *   on every HMR update during dev). The result is a plain object whose
 *   keys are the matched file paths. We derive the job list from those
 *   keys — no HTTP fetch, no JSON manifest, no caching issues.
 *
 * Adding a new PDF:
 *   In dev  → save the file, Vite HMR picks it up instantly on next
 *             page interaction (or manual refresh).
 *   In prod → rebuild (`npm run build`) — the new PDF is baked in.
 */

// Glob over every PDF in public/JD.
// `eager: true`  → resolved synchronously (no dynamic import promise).
// `query: "url"` → each value is the public URL string for the file.
const pdfModules = import.meta.glob("/public/JD/*.pdf", {
  eager: true,
  query: "?url",
  import: "default",
});

// ── helpers ────────────────────────────────────────────────────────────────

function toSlug(str) {
  return str
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function inferDept(title) {
  const t = title.toLowerCase();
  if (/qa|quality assurance|test/.test(t))                               return "QA";
  if (/security|compliance/.test(t))                                     return "Security";
  if (/devops|infrastructure|sre|platform engineer/.test(t))             return "DevOps";
  if (/android|ios|flutter|mobile|react native/.test(t))                 return "Mobile";
  if (/designer|design|\bux\b|\bui\b/.test(t))                           return "Design";
  if (/product manager|product owner/.test(t))                           return "Product";
  if (/data engineer|data scientist|\bml\b|machine learning|\bai\b/.test(t)) return "AI & Data";
  if (/blockchain|solana|smart contract|web3|defi|dao|nft/.test(t))      return "Blockchain";
  if (/manager|director|cto|chief|head of|engineering lead/.test(t))     return "Management";
  if (/support/.test(t))                                                  return "Support";
  return "Engineering";
}

/** Strip the " — Subtitle" suffix many filenames carry, then remove .pdf */
function cleanTitle(filename) {
  return filename
    .replace(/\.pdf$/i, "")
    .replace(/\s[—–]\s.*$/, "")
    .trim();
}

// ── build the jobs list synchronously from the glob ────────────────────────

const jobs = Object.entries(pdfModules)
  .map(([fsPath, url]) => {
    // fsPath  → "/public/JD/Senior Web3 Backend Engineer — Web3 Fintech & Payments.pdf"
    // url     → "/JD/Senior Web3 Backend Engineer — Web3 Fintech & Payments.pdf"
    const filename = fsPath.split("/").pop();          // bare filename
    const title    = cleanTitle(filename);
    return { filename, title, url };
  })
  .sort((a, b) => a.title.localeCompare(b.title))     // alphabetical
  .map(({ title, url }, idx) => ({
    id:       idx + 1,
    title,
    slug:     toSlug(title),
    dept:     inferDept(title),
    type:     "Full-time",
    location: "Warsaw, PL (Hybrid)",
    pdf:      url,                                     // correct public URL
  }));

// ── hook ───────────────────────────────────────────────────────────────────

/**
 * Returns the job list derived directly from the files present in
 * /public/JD/ at build time. Always synchronous — loading is always
 * false, error is always empty.
 */
export function useJobs() {
  return { jobs, loading: false, error: "" };
}
