import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function pill(status) {
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

export default function TenantMaintenanceListPage() {
  const access = useAuth((s) => s.access);
  const navigate = useNavigate();

  const [status, setStatus] = useState("");
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
        const data = await api.listMaintenance(access, { status: status || undefined });
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load maintenance requests");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access, status]);

  const rows = useMemo(() => items, [items]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Maintenance</h1>
          <p className="text-slate-500 text-sm mt-1">Submit and track maintenance requests.</p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          >
            <option value="">All</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <button
            onClick={() => navigate("/tenant/maintenance/new")}
            className="px-5 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700"
          >
            New Request
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-extrabold">No requests yet</h3>
            <p className="text-sm text-slate-500 mt-2">Create your first maintenance request.</p>
            <button
              onClick={() => navigate("/tenant/maintenance/new")}
              className="mt-6 px-6 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700"
            >
              Create Request
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {rows.map((r) => (
              <li key={r.id} className="p-6 flex items-start justify-between gap-6">
                <div>
                  <p className="font-extrabold text-slate-900 dark:text-white">
                    {r.title || "Maintenance Request"} <span className="text-slate-400 font-bold">#{r.id}</span>
                  </p>
                  <p className="text-sm text-slate-500 mt-1">
                    {r.property_name} • {r.category} • Priority: {r.priority}
                  </p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 line-clamp-2">{r.description}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${pill(r.status)}`}>
                    {r.status}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">{new Date(r.created_at).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
