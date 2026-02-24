import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function statusPill(status) {
  switch (status) {
    case "RESOLVED":
      return "bg-emerald-100 text-emerald-700";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-700";
    case "OPEN":
    default:
      return "bg-amber-100 text-amber-700";
  }
}

export default function LandlordMaintenanceInboxPage() {
  const access = useAuth((s) => s.access);

  const [tab, setTab] = useState(""); // ""=all, OPEN, IN_PROGRESS, RESOLVED
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access) return;
      setLoading(true);
      setError("");
      try {
        const data = await api.listMaintenance(access, { status: tab || undefined, q: query || undefined });
        if (cancelled) return;
        const arr = Array.isArray(data) ? data : [];
        setItems(arr);
        if (!selectedId && arr[0]?.id) setSelectedId(arr[0].id);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load maintenance inbox");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access, tab, query]);

  const selected = useMemo(() => items.find((x) => x.id === selectedId) || null, [items, selectedId]);

  async function setStatus(newStatus) {
    if (!access || !selected) return;
    setError("");
    try {
      const updated = await api.updateMaintenanceStatus(access, selected.id, { status: newStatus });
      setItems((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
    } catch (e) {
      setError(e?.message || "Failed to update status");
    }
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background-light dark:bg-background-dark">
      <div className="max-w-[1440px] mx-auto px-6 py-6">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Maintenance Inbox</h1>
            <p className="text-slate-500 text-sm mt-1">Review and update maintenance requests.</p>
          </div>

          <div className="hidden lg:block">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-[320px] px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
            />
          </div>
        </div>

        {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: list */}
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold ${tab === "" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setTab("OPEN")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold ${tab === "OPEN" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                >
                  Pending
                </button>
                <button
                  onClick={() => setTab("IN_PROGRESS")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold ${tab === "IN_PROGRESS" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                >
                  In Progress
                </button>
                <button
                  onClick={() => setTab("RESOLVED")}
                  className={`flex-1 px-3 py-1.5 rounded-full text-xs font-semibold ${tab === "RESOLVED" ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"}`}
                >
                  Resolved
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-6 text-sm text-slate-500">Loading…</div>
            ) : items.length === 0 ? (
              <div className="p-10 text-center">
                <h3 className="text-lg font-extrabold">No tickets</h3>
                <p className="text-sm text-slate-500 mt-2">No maintenance requests match your filters.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[70vh] overflow-y-auto">
                {items.map((t) => (
                  <li
                    key={t.id}
                    onClick={() => setSelectedId(t.id)}
                    className={`p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/30 ${selectedId === t.id ? "bg-primary/5" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-extrabold">{t.title || "Maintenance Request"}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {t.property_name} • {t.tenant_username}
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold ${statusPill(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2">{t.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Right: detail */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
            {!selected ? (
              <div className="text-sm text-slate-500">Select a ticket to view details.</div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black">{selected.title || "Maintenance Request"}</h2>
                    <p className="text-sm text-slate-500 mt-1">
                      #{selected.id} • {selected.property_name} • {selected.tenant_username}
                    </p>
                    <p className="text-sm text-slate-500 mt-1">Category: {selected.category} • Priority: {selected.priority}</p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${statusPill(selected.status)}`}>
                    {selected.status}
                  </span>
                </div>

                <div className="mt-6">
                  <h3 className="text-sm font-extrabold text-slate-400 uppercase tracking-widest">Description</h3>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selected.description || "—"}</p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => setStatus("OPEN")}
                    className="px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    Set Open
                  </button>
                  <button
                    onClick={() => setStatus("IN_PROGRESS")}
                    className="px-4 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700"
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => setStatus("RESOLVED")}
                    className="px-4 h-10 rounded-lg bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700"
                  >
                    Resolve
                  </button>
                </div>

                <p className="text-xs text-slate-400 mt-4">Created: {new Date(selected.created_at).toLocaleString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
