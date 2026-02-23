import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

export default function LandlordEditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const access = useAuth((s) => s.access);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [units, setUnits] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");
  const [statusValue, setStatusValue] = useState("VACANT");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access || !id) return;
      setLoading(true);
      setError("");

      try {
        const p = await api.getProperty(access, id);
        if (cancelled) return;

        setName(p?.name || "");
        setStreetAddress(p?.street_address || "");
        setCity(p?.city || "");
        setState(p?.state || "");
        setZipCode(p?.zip_code || "");
        setUnits(String(p?.units ?? ""));
        setMonthlyRent(String(p?.monthly_rent ?? ""));
        setStatusValue(p?.status || "VACANT");
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load property");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access, id]);

  const canSubmit = useMemo(() => {
    return name.trim() && streetAddress.trim() && !submitting;
  }, [name, streetAddress, submitting]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!access || !id) return;

    setSubmitting(true);
    setError("");

    try {
      const rentValue = parseFloat(String(monthlyRent).replace(/[^0-9.]/g, "")) || 0;

      await api.updateProperty(access, id, {
        name: name.trim(),
        street_address: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zip_code: zipCode.trim(),
        units: parseInt(units, 10) || 0,
        monthly_rent: rentValue,
        status: statusValue,
      });

      navigate(`/landlord/properties/${id}`);
    } catch (e) {
      setError(e?.message || "Failed to update property");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Edit Property</h1>
            <p className="text-slate-500 text-sm mt-1">Update your property details.</p>
          </div>
          <button
            onClick={() => navigate(`/landlord/properties/${id}`)}
            className="px-4 h-10 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>

        {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="name">Property Name *</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="status">Status</label>
              <select
                id="status"
                value={statusValue}
                onChange={(e) => setStatusValue(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="VACANT">Vacant</option>
                <option value="OCCUPIED">Occupied</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold" htmlFor="street">Street Address *</label>
            <input
              id="street"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="city">City</label>
              <input id="city" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="state">State</label>
              <input id="state" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="zip">ZIP</label>
              <input id="zip" value={zipCode} onChange={(e) => setZipCode(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="units">Units</label>
              <input id="units" type="number" min={0} value={units} onChange={(e) => setUnits(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold" htmlFor="rent">Monthly Rent</label>
              <input id="rent" value={monthlyRent} onChange={(e) => setMonthlyRent(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="e.g. 1200" />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-6 h-11 rounded-lg bg-primary text-white text-sm font-bold disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
