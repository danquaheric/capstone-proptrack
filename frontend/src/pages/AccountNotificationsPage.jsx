import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex items-center w-12 h-7 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-slate-200 dark:bg-slate-700"
      } ${disabled ? "opacity-60" : ""}`}
      aria-pressed={checked}
    >
      <span
        className={`absolute left-1 top-1 w-5 h-5 rounded-full bg-white transition-transform ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

export default function AccountNotificationsPage() {
  const access = useAuth((s) => s.access);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [prefs, setPrefs] = useState({
    mute_all: false,
    rent_updates: true,
    maintenance_updates: true,
    tenant_updates: true,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access) return;
      setLoading(true);
      setError("");
      try {
        const data = await api.getNotificationPreferences(access);
        if (!cancelled && data) setPrefs((p) => ({ ...p, ...data }));
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load preferences");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access]);

  async function update(next) {
    if (!access) return;
    setSaving(true);
    setError("");
    try {
      const saved = await api.updateNotificationPreferences(access, next);
      setPrefs((p) => ({ ...p, ...saved }));
    } catch (e) {
      setError(e?.message || "Failed to save preferences");
    } finally {
      setSaving(false);
    }
  }

  const disabled = loading || saving;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 lg:px-12">
      <header className="mb-8">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Notification Preferences</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Control how you want to be notified about your property activity.</p>
      </header>

      {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-extrabold">Mute All Notifications</p>
            <p className="text-xs text-slate-500 mt-1">Global pause on all alerts</p>
          </div>
          <Toggle
            checked={!!prefs.mute_all}
            disabled={disabled}
            onChange={(v) => update({ mute_all: v })}
          />
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <p className="text-sm font-extrabold">Rent Updates</p>
              <p className="text-xs text-slate-500 mt-1">Payment reminders, receipts, and rent status changes.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">In-app</span>
                <Toggle
                  checked={!!prefs.rent_updates}
                  disabled={disabled || prefs.mute_all}
                  onChange={(v) => update({ rent_updates: v })}
                />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <p className="text-sm font-extrabold">Maintenance Updates</p>
              <p className="text-xs text-slate-500 mt-1">Ticket created, status updates, and resolution notices.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">In-app</span>
                <Toggle
                  checked={!!prefs.maintenance_updates}
                  disabled={disabled || prefs.mute_all}
                  onChange={(v) => update({ maintenance_updates: v })}
                />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5">
              <p className="text-sm font-extrabold">Tenant/Assignment Updates</p>
              <p className="text-xs text-slate-500 mt-1">Tenant assignment and property access updates.</p>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-600">In-app</span>
                <Toggle
                  checked={!!prefs.tenant_updates}
                  disabled={disabled || prefs.mute_all}
                  onChange={(v) => update({ tenant_updates: v })}
                />
              </div>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 bg-slate-50 dark:bg-slate-800/40">
              <p className="text-sm font-extrabold">Status</p>
              <p className="text-xs text-slate-500 mt-1">{loading ? "Loading…" : saving ? "Saving…" : "Up to date"}</p>
              <p className="text-xs text-slate-400 mt-3">MVP: email/SMS channels can be added later.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
