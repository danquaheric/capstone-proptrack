import { Outlet } from "react-router-dom";

/**
 * Layout for public pages (marketing + auth).
 * Keeps the page fully controlled by each screen (e.g., full-screen homepage).
 */
export default function MarketingLayout() {
  return <Outlet />;
}
