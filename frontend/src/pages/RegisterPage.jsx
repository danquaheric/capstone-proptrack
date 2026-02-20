import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { roleHome } from "../routes/role";
import { useAuth } from "../store/auth";

function splitFullName(fullName) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { first: parts[0] || "", last: "" };
  return { first: parts.slice(0, -1).join(" "), last: parts.slice(-1).join(" ") };
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const register = useAuth((s) => s.register);

  const [role, setRole] = useState("tenant");

  const [fullName, setFullName] = useState("");
  const name = useMemo(() => splitFullName(fullName), [fullName]);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({
        username,
        email,
        password,
        first_name: name.first,
        last_name: name.last,
        role: role === "landlord" ? "LANDLORD" : "TENANT",
      });
      const u = useAuth.getState().user;
      if (u) navigate(roleHome(u.role));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="layout-container flex h-full grow flex-col">
        {/* Top Navigation */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 lg:px-40 py-4 bg-white dark:bg-slate-900">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center size-8 bg-primary rounded-lg text-white">
              <span className="material-symbols-outlined text-xl">domain</span>
            </div>
            <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-tight">PropTrack</h2>
          </Link>
          <div className="flex items-center gap-6">
            <span className="hidden md:block text-slate-500 dark:text-slate-400 text-sm font-medium">
              Already have an account?
            </span>
            <Link
              to="/login"
              className="flex min-w-[84px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary/10 hover:bg-primary/20 text-primary text-sm font-bold transition-colors"
            >
              Log In
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 items-center justify-center p-6 md:p-12">
          <div className="w-full max-w-[560px] bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-8 md:p-12">
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-3">Create your account</h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Join thousands of landlords and tenants managing property smarter.
                </p>
              </div>

              {error && <div className="mb-6 rounded-lg bg-red-50 text-red-700 p-3 text-sm">{error}</div>}

              <form className="space-y-8" onSubmit={onSubmit}>
                {/* Role Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">I am registering as a...</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Landlord Card */}
                    <label className="relative cursor-pointer group">
                      <input
                        className="peer sr-only"
                        name="role"
                        type="radio"
                        value="landlord"
                        checked={role === "landlord"}
                        onChange={() => setRole("landlord")}
                      />
                      <div className="flex flex-col items-start p-5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all h-full">
                        <div className="mb-4 size-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined">real_estate_agent</span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white mb-1">Landlord</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Manage properties, track leases &amp; collect rent</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 text-primary">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </div>
                    </label>

                    {/* Tenant Card */}
                    <label className="relative cursor-pointer group">
                      <input
                        className="peer sr-only"
                        name="role"
                        type="radio"
                        value="tenant"
                        checked={role === "tenant"}
                        onChange={() => setRole("tenant")}
                      />
                      <div className="flex flex-col items-start p-5 rounded-xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-primary/50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all h-full">
                        <div className="mb-4 size-10 flex items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined">person</span>
                        </div>
                        <p className="font-bold text-slate-900 dark:text-white mb-1">Tenant</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Pay rent, report issues &amp; view your lease</p>
                      </div>
                      <div className="absolute top-3 right-3 opacity-0 peer-checked:opacity-100 text-primary">
                        <span className="material-symbols-outlined text-lg">check_circle</span>
                      </div>
                    </label>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Note: Admin accounts are created internally; signups are limited to tenants and landlords.
                  </p>
                </div>

                {/* Personal Information */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="name">
                      Full name
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">badge</span>
                      <input
                        id="name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="username">
                      Username
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">alternate_email</span>
                      <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="johndoe"
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="email">
                      Email
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className="w-full pl-12 pr-4 py-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 ml-1" htmlFor="password">
                      Password
                    </label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">lock</span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-12 py-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        onClick={() => setShowPassword((v) => !v)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <span className="material-symbols-outlined">{showPassword ? "visibility_off" : "visibility"}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Creating account…" : "Create account"}
                </button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  By creating an account, you agree to our Terms and Privacy Policy.
                </p>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
