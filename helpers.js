// Subcodigos en js/helpers.js

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function truncate(text, n) {
  return text.length > n ? text.slice(0, n - 1) + "…" : text;
}
