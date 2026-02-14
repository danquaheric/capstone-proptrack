import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../store/auth";

export default function TenantLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (p: string) => pathname === p;

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shrink-0">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-white">domain</span>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-none">PropManage</h1>
                <p className="text-xs text-slate-500 font-medium">Tenant Portal</p>
              </div>
            </Link>

            <nav className="space-y-1">
              <Link
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
                  isActive("/tenant") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                }`}
                to="/tenant"
              >
                <span className="material-symbols-outlined">dashboard</span>
                <span>Dashboard</span>
              </Link>
              <Link
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
                  isActive("/tenant/rent") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                }`}
                to="/tenant/rent"
              >
                <span className="material-symbols-outlined">receipt_long</span>
                <span>My Rent</span>
              </Link>
              <Link
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
                  isActive("/tenant/maintenance") ? "bg-primary/10 text-primary" : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                }`}
                to="/tenant/maintenance"
              >
                <span className="material-symbols-outlined">build</span>
                <span>Maintenance</span>
              </Link>
              <Link
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium ${
                  isActive("/tenant/notifications")
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                }`}
                to="/tenant/notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span>Notifications</span>
                <span className="ml-auto w-5 h-5 bg-primary text-white text-[10px] flex items-center justify-center rounded-full">3</span>
              </Link>
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-slate-200 dark:border-slate-800">
            <button
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark">
          {/* Header */}
          <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
            <h2 className="text-xl font-semibold">Welcome back, {user?.first_name || user?.username || ""}</h2>
            <div className="flex items-center gap-4">
              <button className="text-slate-500 hover:text-slate-700" type="button">
                <span className="material-symbols-outlined">search</span>
              </button>
              <div className="flex items-center gap-2 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <span className="text-sm font-medium">{user?.username || ""}</span>
              </div>
            </div>
          </header>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
