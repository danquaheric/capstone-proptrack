import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function statusPill(status) {
  switch (status) {
    case "OCCUPIED":
      return {
        label: "Occupied",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        dot: "bg-emerald-500",
      };
    case "MAINTENANCE":
      return {
        label: "Maintenance",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        dot: "bg-blue-500",
      };
    case "VACANT":
    default:
      return {
        label: "Vacant",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        dot: "bg-amber-500",
      };
  }
}

export default function LandlordPropertyListPage() {
  const navigate = useNavigate();
  const access = useAuth((s) => s.access);

  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access) return;
      setLoading(true);
      setError("");
      try {
        const data = await api.listProperties(access);
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load properties");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) => {
      const hay = `${p.name} ${p.street_address} ${p.city || ""} ${p.state || ""} ${p.zip_code || ""}`.toLowerCase();
      return hay.includes(q);
    });
  }, [items, query]);

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex flex-col min-h-screen w-full">
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined !text-2xl">apartment</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">PropTrack</h1>
            </div>

            <div className="flex-1 max-w-xl">
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  search
                </span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-none rounded-lg pl-10 pr-4 h-10 text-sm focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-400"
                  placeholder="Search by name or address..."
                  type="text"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/landlord/properties/new")}
                className="flex items-center gap-2 px-6 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined !text-lg">add</span> Add Property
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                Property Inventory
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-base">
                You have{" "}
                <span className="text-slate-900 dark:text-slate-200 font-semibold">
                  {filtered.length} properties
                </span>
                .
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            {error ? (
              <div className="p-6">
                <p className="text-sm font-semibold text-red-600">{error}</p>
              </div>
            ) : loading ? (
              <div className="p-6">
                <p className="text-sm text-slate-500">Loading...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-10 text-center">
                <div className="mx-auto w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                  <span className="material-symbols-outlined text-slate-400">domain</span>
                </div>
                <h3 className="text-lg font-extrabold">No properties yet</h3>
                <p className="text-sm text-slate-500 mt-2">
                  Create your first property to start managing your inventory.
                </p>
                <button
                  onClick={() => navigate("/landlord/properties/new")}
                  className="mt-6 inline-flex items-center gap-2 px-6 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all"
                >
                  <span className="material-symbols-outlined !text-lg">add</span> Add Property
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Address</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Units</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Rent</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filtered.map((p) => {
                      const pill = statusPill(p.status);
                      return (
                        <tr
                          key={p.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center">
                                <span className="material-symbols-outlined text-slate-400">domain</span>
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                  {p.name}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">Property</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {p.street_address}
                              {(p.city || p.state || p.zip_code) && (
                                <>
                                  {", "}{
                                    [p.city, p.state, p.zip_code].filter(Boolean).join(" ")
                                  }
                                </>
                              )}
                            </p>
                          </td>
                          <td className="px-6 py-4 text-sm font-medium">{p.units ?? 0}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                              ${Number(p.monthly_rent ?? 0).toLocaleString()}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${pill.className}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`}></span> {pill.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                              <span className="material-symbols-outlined !text-xl">more_vert</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
