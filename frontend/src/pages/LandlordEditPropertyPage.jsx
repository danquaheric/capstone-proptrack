import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

export default function LandlordEditPropertyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const access = useAuth((s) => s.access);
  const ensureAccess = useAuth((s) => s.ensureAccess);

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

  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);
  const [newPhotos, setNewPhotos] = useState([]);
  const [photosError, setPhotosError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access || !id) return;
      setLoading(true);
      setError("");
      setPhotosError("");

      try {
        const freshAccess = await ensureAccess();
        const p = await api.getProperty(freshAccess, id);
        if (cancelled) return;

        setName(p?.name || "");
        setStreetAddress(p?.street_address || "");
        setCity(p?.city || "");
        setState(p?.state || "");
        setZipCode(p?.zip_code || "");
        setUnits(String(p?.units ?? ""));
        setMonthlyRent(String(p?.monthly_rent ?? ""));
        setStatusValue(p?.status || "VACANT");

        setPhotosLoading(true);
        const ph = await api.listPropertyPhotos(freshAccess, id);
        if (!cancelled) setPhotos(Array.isArray(ph) ? ph : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load property");
      } finally {
        if (!cancelled) {
          setLoading(false);
          setPhotosLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [access, id, ensureAccess]);

  const canSubmit = useMemo(() => {
    return name.trim() && streetAddress.trim() && !submitting;
  }, [name, streetAddress, submitting]);

  async function deletePhoto(photoId) {
    if (!access || !id) return;
    setPhotosError("");
    try {
      const freshAccess = await ensureAccess();
      await api.deletePropertyPhoto(freshAccess, id, photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    } catch (e) {
      setPhotosError(e?.message || "Failed to delete photo");
    }
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!access || !id) return;

    setSubmitting(true);
    setError("");
    setPhotosError("");

    try {
      const freshAccess = await ensureAccess();
      const rentValue = parseFloat(String(monthlyRent).replace(/[^0-9.]/g, "")) || 0;

      await api.updateProperty(freshAccess, id, {
        name: name.trim(),
        street_address: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zip_code: zipCode.trim(),
        units: parseInt(units, 10) || 0,
        monthly_rent: rentValue,
        status: statusValue,
      });

      // Upload new photos (optional)
      if (newPhotos.length) {
        for (let i = 0; i < newPhotos.length; i++) {
          const file = newPhotos[i];
          await api.uploadPropertyPhoto(freshAccess, id, file, { sort_order: photos.length + i });
        }
      }

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

        <form onSubmit={onSubmit} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 space-y-8">
          {/* Basic Info */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Basic Info</h2>
            </div>
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

          <div className="flex flex-col gap-2 mt-4">
            <label className="text-sm font-semibold" htmlFor="street">Street Address *</label>
            <input
              id="street"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
          </section>

          {/* Units & Pricing */}
          <section>
            <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Units & Pricing</h2>
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
          </section>

          {/* Photos */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Photos</h2>
              <label className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold cursor-pointer hover:bg-blue-700">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length) setNewPhotos((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
                Add Photos
              </label>
            </div>

            {photosError ? <p className="mb-3 text-sm font-semibold text-red-600">{photosError}</p> : null}

            {photosLoading ? (
              <p className="text-sm text-slate-500">Loading photos...</p>
            ) : photos.length === 0 ? (
              <div className="p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">No photos uploaded yet</p>
                <p className="text-xs text-slate-500 mt-1">Add photos to help tenants recognize the property.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {photos.map((p) => (
                  <div key={p.id} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                    <img src={p.image_url} alt="Property" className="w-full h-28 object-cover" />
                    <button
                      type="button"
                      onClick={() => deletePhoto(p.id)}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {newPhotos.length ? (
              <div className="mt-5">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">New Photos (will upload on Save)</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {newPhotos.map((file, idx) => {
                    const url = URL.createObjectURL(file);
                    return (
                      <div key={`${file.name}-${idx}`} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <img src={url} alt={file.name} className="w-full h-28 object-cover" onLoad={() => URL.revokeObjectURL(url)} />
                        <button
                          type="button"
                          onClick={() => setNewPhotos((prev) => prev.filter((_, i) => i !== idx))}
                          className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] px-2 py-1 truncate">
                          {file.name}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </section>

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
