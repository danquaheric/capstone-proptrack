const KEY = "proptrack_theme"; // "light" | "dark"

export function getTheme() {
  if (typeof window === "undefined") return "light";
  const v = window.localStorage.getItem(KEY);
  return v === "dark" ? "dark" : "light";
}

export function setTheme(next) {
  if (typeof window === "undefined") return;
  const theme = next === "dark" ? "dark" : "light";
  window.localStorage.setItem(KEY, theme);
  applyTheme(theme);
}

export function applyTheme(theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
}
