import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";
import type { UserRole } from "../lib/api";

export function ProtectedRoute() {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) return <div className="p-6">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
}

export function RoleRoute({ allow }: { allow: UserRole[] }) {
  const { user, isBootstrapping } = useAuth();

  if (isBootstrapping) return <div className="p-6">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!allow.includes(user.role)) return <Navigate to="/access-denied" replace />;

  return <Outlet />;
}

export function roleHome(role: UserRole): string {
  if (role === "LANDLORD") return "/landlord";
  if (role === "ADMIN") return "/admin";
  return "/tenant";
}
