import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function pill(status) {
  switch (status) {
    case "PAID":
      return { label: "Paid", cls: "bg-emerald-100 text-emerald-700" };
    case "OVERDUE":
      return { label: "Overdue", cls: "bg-red-100 text-red-700" };
    case "UNPAID":
    default:
      return { label: "Unpaid", cls: "bg-amber-100 text-amber-700" };
  }
}

export default function TenantDashboardPage() {
  const access = useAuth((s) => s.access);

  const [items, setItems] = useState([]);
  const [rentStatus, setRentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access) return;
      setLoading(true);
      setError("");
      try {
        const [props, status] = await Promise.all([
          api.listProperties(access),
          api.tenantRentStatus(access),
        ]);

        if (cancelled) return;
        setItems(Array.isArray(props) ? props : []);
        setRentStatus(status || null);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access]);

  const primaryProperty = items[0] || null;

  const monthlyTotal = useMemo(() => {
    return items.reduce((sum, p) => sum + Number(p?.monthly_rent ?? 0), 0);
  }, [items]);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Live data pulled from your assigned properties.</p>
      </div>

      {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Next Rent Due</p>
            <p className="mt-2 text-3xl font-black">
              {loading
                ? "…"
                : rentStatus?.next_due
                  ? `$${Number(rentStatus.next_due.amount ?? 0).toLocaleString()}`
                  : "—"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {loading
                ? ""
                : rentStatus?.next_due
                  ? `Due: ${rentStatus.next_due.due_date}`
                  : "No upcoming rent record."}
            </p>
          </div>
          <div>
            {rentStatus?.next_due ? (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold ${pill(rentStatus.next_due.status).cls}`}>
                {pill(rentStatus.next_due.status).label}
              </span>
            ) : null}
          </div>
        </div>

        {rentStatus?.totals ? (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Overdue Total</p>
              <p className="mt-1 text-lg font-extrabold">${Number(rentStatus.totals.overdue ?? 0).toLocaleString()}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/40 rounded-lg p-4">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Unpaid (Upcoming)</p>
              <p className="mt-1 text-lg font-extrabold">${Number(rentStatus.totals.unpaid ?? 0).toLocaleString()}</p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Properties</p>
          <p className="mt-2 text-3xl font-black">{loading ? "…" : items.length}</p>
          <p className="mt-2 text-sm text-slate-500">Only properties assigned by your landlord appear here.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Monthly Rent (Total)</p>
          <p className="mt-2 text-3xl font-black">{loading ? "…" : `$${monthlyTotal.toLocaleString()}`}</p>
          <p className="mt-2 text-sm text-slate-500">Payments/invoices will populate this in Week 3.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Primary Property</p>
          <p className="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">
            {loading ? "…" : primaryProperty?.name || "None"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            {loading
              ? ""
              : primaryProperty
                ? `${primaryProperty.street_address}${primaryProperty.city ? ", " + primaryProperty.city : ""}${primaryProperty.state ? ", " + primaryProperty.state : ""} ${primaryProperty.zip_code || ""}`
                : "Ask your landlord to assign you to a property."}
          </p>
        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
        <h2 className="text-lg font-extrabold">Properties</h2>
        <p className="text-sm text-slate-500 mt-1">This list is real-time from the database.</p>

        {loading ? (
          <div className="py-8 text-sm text-slate-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-8 text-sm text-slate-500">No property assigned yet.</div>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((p) => (
              <li key={p.id} className="py-4 flex items-start justify-between gap-6">
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                  <p className="text-sm text-slate-500 mt-1">
                    {p.street_address}
                    {(p.city || p.state || p.zip_code)
                      ? `, ${[p.city, p.state, p.zip_code].filter(Boolean).join(" ")}`
                      : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Monthly Rent</p>
                  <p className="font-extrabold">${Number(p.monthly_rent ?? 0).toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
