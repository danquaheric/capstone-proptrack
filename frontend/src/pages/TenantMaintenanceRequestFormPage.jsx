import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

const CATEGORIES = [
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "HVAC", label: "HVAC / Air Conditioning" },
  { value: "APPLIANCES", label: "Kitchen Appliances" },
  { value: "STRUCTURAL", label: "Structural / Windows / Doors" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Med" },
  { value: "HIGH", label: "High" },
  { value: "EMERGENCY", label: "Alert" },
];

export default function TenantMaintenanceRequestFormPage() {
  const access = useAuth((s) => s.access);
  const navigate = useNavigate();

  const [properties, setProperties] = useState([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [rentalProperty, setRentalProperty] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access) return;
      setLoadingProps(true);
      setError("");
      try {
        const props = await api.listProperties(access);
        if (cancelled) return;
        const arr = Array.isArray(props) ? props : [];
        setProperties(arr);
        if (arr[0]?.id) setRentalProperty(String(arr[0].id));
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load properties");
      } finally {
        if (!cancelled) setLoadingProps(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access]);

  const canSubmit = useMemo(() => {
    return rentalProperty && category && description.trim() && !submitting;
  }, [rentalProperty, category, description, submitting]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!access) return;

    setSubmitting(true);
    setError("");
    try {
      await api.createMaintenance(access, {
        rental_property: parseInt(rentalProperty, 10),
        category,
        priority,
        title: title.trim(),
        description: description.trim(),
      });
      navigate("/tenant/maintenance");
    } catch (e) {
      setError(e?.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight">Create Maintenance Request</h1>
        <p className="text-slate-500 text-sm mt-1">Provide details about the issue to help resolve it quickly.</p>
      </div>

      {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

      <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Property</label>
            <select
              value={rentalProperty}
              onChange={(e) => setRentalProperty(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              disabled={loadingProps}
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            {properties.length === 0 && !loadingProps ? (
              <p className="text-xs text-slate-500">No property assigned. Ask your landlord to assign one.</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            >
              <option value="" disabled>
                Select an issue category
              </option>
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Priority Level</label>
          <div className="flex h-12 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 p-1">
            {PRIORITIES.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`flex-1 h-full rounded-md text-xs font-extrabold uppercase tracking-wider transition-all ${
                  priority === p.value
                    ? p.value === "EMERGENCY"
                      ? "bg-red-500 text-white"
                      : "bg-white dark:bg-slate-700 text-primary shadow-sm"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Title (optional)</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            placeholder="e.g. Leaking sink"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold">Description of the issue</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            placeholder="Please provide as much detail as possible, including when the problem started..."
            rows={5}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/tenant/maintenance")}
            className="px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-bold"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="px-6 h-10 rounded-lg bg-primary text-white text-sm font-bold disabled:opacity-50"
          >
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
