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

export default function LandlordRentOverviewPage() {
  const access = useAuth((s) => s.access);

  const [status, setStatus] = useState("");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ rental_property: "", tenant: "", amount: "", due_date: "" });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access) return;
      setLoading(true);
      setError("");
      try {
        const data = await api.listRentPayments(access, { status: status || undefined, q: query || undefined });
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
  }, [access, status, query]);

  const rows = useMemo(() => items, [items]);

  async function markPaid(id) {
    if (!access) return;
    try {
      const updated = await api.updateRentPayment(access, id, { paid_at: new Date().toISOString() });
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setError(e?.message || "Failed to mark paid");
    }
  }

  async function setUnpaid(id) {
    if (!access) return;
    try {
      const updated = await api.updateRentPayment(access, id, { paid_at: null });
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setError(e?.message || "Failed to set unpaid");
    }
  }

  async function createRent(e) {
    e.preventDefault();
    if (!access) return;

    setError("");
    try {
      const payload = {
        rental_property: parseInt(createForm.rental_property, 10),
        tenant: parseInt(createForm.tenant, 10),
        amount: parseFloat(String(createForm.amount).replace(/[^0-9.]/g, "")) || 0,
        due_date: createForm.due_date,
      };
      const created = await api.createRentPayment(access, payload);
      setItems((prev) => [created, ...prev]);
      setCreateOpen(false);
      setCreateForm({ rental_property: "", tenant: "", amount: "", due_date: "" });
    } catch (e) {
      setError(e?.message || "Failed to create rent payment");
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Rent Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Track tenant rent status and payment history.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tenant or property..."
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          />
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
          <button
            onClick={() => setCreateOpen(true)}
            className="px-5 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700"
          >
            Create Rent Record
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-extrabold">No rent records yet</h3>
            <p className="text-sm text-slate-500 mt-2">Create your first rent record for an assigned tenant.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Tenant</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Property</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Paid At</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {rows.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{r.tenant_username}</td>
                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{r.property_name}</td>
                    <td className="px-6 py-4 text-sm font-semibold">{r.due_date}</td>
                    <td className="px-6 py-4 text-sm font-extrabold">${Number(r.amount ?? 0).toLocaleString()}</td>
                    <td className="px-6 py-4"><StatusPill status={r.status} /></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{r.paid_at ? new Date(r.paid_at).toLocaleString() : "—"}</td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {r.paid_at ? (
                        <button onClick={() => setUnpaid(r.id)} className="px-3 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800">
                          Set Unpaid
                        </button>
                      ) : (
                        <button onClick={() => markPaid(r.id)} className="px-3 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary/10">
                          Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {createOpen ? (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setCreateOpen(false)}>
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-extrabold">Create Rent Record</h4>
              <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setCreateOpen(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={createRent} className="space-y-3">
              <div>
                <label className="text-sm font-semibold">Property ID</label>
                <input
                  value={createForm.rental_property}
                  onChange={(e) => setCreateForm((s) => ({ ...s, rental_property: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-semibold">Tenant ID</label>
                <input
                  value={createForm.tenant}
                  onChange={(e) => setCreateForm((s) => ({ ...s, tenant: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  placeholder="e.g. 5"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold">Amount</label>
                  <input
                    value={createForm.amount}
                    onChange={(e) => setCreateForm((s) => ({ ...s, amount: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    placeholder="e.g. 1200"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold">Due Date</label>
                  <input
                    type="date"
                    value={createForm.due_date}
                    onChange={(e) => setCreateForm((s) => ({ ...s, due_date: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button type="button" onClick={() => setCreateOpen(false)} className="px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold">
                  Cancel
                </button>
                <button type="submit" className="px-5 h-10 rounded-lg bg-primary text-white text-sm font-bold">
                  Create
                </button>
              </div>

              <p className="text-xs text-slate-500">
                Note: this MVP uses raw IDs. Next improvement: dropdown selectors for your properties + tenant search.
              </p>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
