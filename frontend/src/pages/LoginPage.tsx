import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { roleHome } from "../routes/guards";
import { useAuth } from "../store/auth";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuth((s) => s.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ username, password });
      const u = useAuth.getState().user;
      if (u) navigate(roleHome(u.role));
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8">
        <h1 className="text-2xl font-extrabold">Sign in</h1>
        <p className="text-sm text-slate-500 mt-2">Welcome back to PropTrack.</p>

        {error && <div className="mt-4 rounded-lg bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Don’t have an account? <Link className="text-primary font-bold" to="/register">Create one</Link>
        </p>

        <p className="mt-4 text-xs text-slate-400">
          Note: New users default to <b>Tenant</b> role (per Week 1 spec).
        </p>
      </div>
    </div>
  );
}
