import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { getTheme, setTheme } from "../lib/theme";
import { useAuth } from "../store/auth";

export default function AppShell() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    setThemeState(getTheme());
  }, []);

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Link to="/" className="font-extrabold text-primary">PropTrack</Link>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = theme === "dark" ? "light" : "dark";
                setTheme(next);
                setThemeState(next);
              }}
              className="h-9 rounded-lg px-3 text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center gap-2"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              <span className="material-symbols-outlined !text-[18px]">{theme === "dark" ? "dark_mode" : "light_mode"}</span>
              <span className="hidden sm:inline">{theme === "dark" ? "Dark" : "Light"}</span>
            </button>

            {user ? (
              <>
                <span className="text-sm text-slate-500 dark:text-slate-300">{user.username} · {user.role}</span>
                <Link
                  to="/account"
                  className="h-9 rounded-lg px-4 text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800 inline-flex items-center"
                >
                  Account
                </Link>
                <button
                  className="h-9 rounded-lg px-4 text-sm font-bold border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="text-sm font-bold" to="/login">Login</Link>
                <Link className="text-sm font-bold text-white bg-primary rounded-lg px-4 py-2" to="/register">Register</Link>
              </>
            )}
          </div>
        </div>
      </div>
      <Outlet />
    </div>
  );
}
