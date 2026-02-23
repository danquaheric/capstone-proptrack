import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

export default function TenantPropertiesPage() {
  const access = useAuth((s) => s.access);

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

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">My Properties</h1>
        <p className="text-slate-500 text-sm mt-1">Read-only view of properties assigned to you.</p>
      </div>

      {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6">
            <p className="text-sm text-slate-500">Loading...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-extrabold">No property assigned yet</h3>
            <p className="text-sm text-slate-500 mt-2">Ask your landlord to assign you to a property.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((p) => (
              <li key={p.id} className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{p.name}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      {p.street_address}
                      {(p.city || p.state || p.zip_code) ? `, ${[p.city, p.state, p.zip_code].filter(Boolean).join(" ")}` : ""}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Monthly Rent</p>
                    <p className="font-extrabold">${Number(p.monthly_rent ?? 0).toLocaleString()}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
