import { useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function TypeBadge({ type }) {
  const map = {
    MAINTENANCE_CREATED: { label: "Maintenance", cls: "bg-blue-100 text-blue-700" },
    MAINTENANCE_STATUS_CHANGED: { label: "Maintenance", cls: "bg-blue-100 text-blue-700" },
    RENT_MARKED_PAID: { label: "Rent", cls: "bg-emerald-100 text-emerald-700" },
    TENANT_ASSIGNED: { label: "Access", cls: "bg-amber-100 text-amber-700" },
  };
  const m = map[type] || { label: type, cls: "bg-slate-100 text-slate-700" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold ${m.cls}`}>{m.label}</span>
  );
}

export default function TenantNotificationsPage() {
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
        const data = await api.listNotifications(access);
        if (!cancelled) setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load notifications");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access]);

  const unreadCount = useMemo(() => items.filter((n) => !n.is_read).length, [items]);

  async function markRead(id) {
    if (!access) return;
    try {
      const updated = await api.markNotificationRead(access, id);
      setItems((prev) => prev.map((n) => (n.id === id ? updated : n)));
    } catch (e) {
      setError(e?.message || "Failed to mark read");
    }
  }

  async function readAll() {
    if (!access) return;
    try {
      await api.readAllNotifications(access);
      setItems((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (e) {
      setError(e?.message || "Failed to mark all read");
    }
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Notifications</h1>
          <p className="text-slate-500 text-sm mt-1">In-app notifications from the system.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-600">Unread: {unreadCount}</span>
          <button
            onClick={readAll}
            className="px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center">
            <h3 className="text-lg font-extrabold">No notifications</h3>
            <p className="text-sm text-slate-500 mt-2">You’ll see updates here when something happens.</p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {items.map((n) => (
              <li key={n.id} className="p-6 flex items-start justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2">
                    <TypeBadge type={n.type} />
                    {!n.is_read ? <span className="text-[10px] font-extrabold text-primary">NEW</span> : null}
                  </div>
                  <p className="mt-2 font-extrabold text-slate-900 dark:text-white">{n.title}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                </div>
                {!n.is_read ? (
                  <button
                    onClick={() => markRead(n.id)}
                    className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20"
                  >
                    Mark read
                  </button>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
