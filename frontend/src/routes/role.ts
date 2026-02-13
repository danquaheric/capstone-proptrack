import type { UserRole } from "../lib/api";

export function roleHome(role: UserRole): string {
  if (role === "LANDLORD") return "/landlord";
  if (role === "ADMIN") return "/admin";
  return "/tenant";
}
