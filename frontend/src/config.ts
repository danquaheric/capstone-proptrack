// If VITE_API_BASE isn't set, default to the same host the frontend is running on.
// This avoids "Failed to fetch" when accessing the dev server from another device.
const defaultBase = typeof window !== "undefined" ? `http://${window.location.hostname}:8000` : "http://localhost:8000";

export const API_BASE = import.meta.env.VITE_API_BASE || defaultBase;
