import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function StatusPill({ status }) {
  const map = {
    PAID: "bg-emerald-100 text-emerald-700",
    UNPAID: "bg-amber-100 text-amber-700",
    OVERDUE: "bg-red-100 text-red-700",
  };
  const cls = map[status] || map.UNPAID;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${cls}`}>
      {status}
    </span>
  );
}

export default function TenantRentPage() {
  const access = useAuth((s) => s.access);

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
        const data = await api.listRentPayments(access, { status: status || undefined });
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load rent payments");
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
          <h1 className="text-2xl font-black tracking-tight">My Rent</h1>
          <p className="text-slate-500 text-sm mt-1">Your rent records from the database.</p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold text-slate-600">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          >
            <option value="">All</option>
            <option value="PAID">Paid</option>
            <option value="UNPAID">Unpaid</option>
            <option value="OVERDUE">Overdue</option>
          </select>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-extrabold">No rent records yet</h3>
            <p className="text-sm text-slate-500 mt-2">Ask your landlord to create your rent schedule.</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold">{r.due_date}</td>
                  <td className="px-6 py-4 text-sm font-extrabold">${Number(r.amount ?? 0).toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <StatusPill status={r.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{r.paid_at ? new Date(r.paid_at).toLocaleString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
