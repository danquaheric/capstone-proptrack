import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { roleHome } from "../routes/guards";
import { useAuth } from "../store/auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ username, email, password, first_name: firstName, last_name: lastName });
      const u = useAuth.getState().user;
      if (u) navigate(roleHome(u.role));
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm p-8">
        <h1 className="text-2xl font-extrabold">Create account</h1>
        <p className="text-sm text-slate-500 mt-2">New users default to Tenant role (Week 1 decision).</p>

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
            <label className="block text-sm font-medium mb-1">Email (optional)</label>
            <input
              type="email"
              className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input
                className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input
                className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button
            disabled={loading}
            className="w-full h-11 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-60"
          >
            {loading ? "Creating…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-500">
          Already have an account? <Link className="text-primary font-bold" to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
