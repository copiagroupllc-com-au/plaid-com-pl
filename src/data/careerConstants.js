/** Converts a job title to a URL-safe slug. */
export function toSlug(title = "") {
  return title
    .toLowerCase()
    .replace(/[—–]/g, "-")
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const DEPT_COLORS = {
  Engineering: { bg: "#3730A3", text: "#A5B4FC" },
  Blockchain:  { bg: "#6D28D9", text: "#C4B5FD" },
  "AI & Data": { bg: "#065F46", text: "#6EE7B7" },
  Mobile:      { bg: "#92400E", text: "#FCD34D" },
  Design:      { bg: "#9D174D", text: "#FBCFE8" },
  Product:     { bg: "#164E63", text: "#67E8F9" },
  Security:    { bg: "#7F1D1D", text: "#FCA5A5" },
  DevOps:      { bg: "#1E3A5F", text: "#93C5FD" },
  QA:          { bg: "#78350F", text: "#FDE68A" },
  Management:  { bg: "#312E81", text: "#A5B4FC" },
  Support:     { bg: "#134E4A", text: "#99F6E4" },
};

export const DEPARTMENTS = [
  "All", "Blockchain", "Engineering", "AI & Data", "Mobile",
  "Design", "Product", "Security", "DevOps", "QA", "Management", "Support",
];
