import { useEffect } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppShell from "./components/AppShell";
import AccessDenied from "./pages/AccessDenied";
import DashboardAdmin from "./pages/DashboardAdmin";
import DashboardLandlord from "./pages/DashboardLandlord";
import DashboardTenant from "./pages/DashboardTenant";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { ProtectedRoute, RoleRoute } from "./routes/guards";
import { useAuth } from "./store/auth";

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/access-denied", element: <AccessDenied /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute allow={["LANDLORD"]} />,
            children: [{ path: "/landlord", element: <DashboardLandlord /> }],
          },
          {
            element: <RoleRoute allow={["TENANT"]} />,
            children: [{ path: "/tenant", element: <DashboardTenant /> }],
          },
          {
            element: <RoleRoute allow={["ADMIN"]} />,
            children: [{ path: "/admin", element: <DashboardAdmin /> }],
          },
        ],
      },
    ],
  },
]);

export default function App() {
  const bootstrap = useAuth((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return <RouterProvider router={router} />;
}
