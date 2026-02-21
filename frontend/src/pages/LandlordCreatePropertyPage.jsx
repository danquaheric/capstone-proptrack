import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

export default function LandlordCreatePropertyPage() {
  const navigate = useNavigate();
  const access = useAuth((s) => s.access);

  const [name, setName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = name.trim() && streetAddress.trim() && !submitting;

  async function onSubmit(e) {
    e.preventDefault();
    if (!access) return;

    setSubmitting(true);
    setError("");
    try {
      await api.createProperty(access, {
        name: name.trim(),
        street_address: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zip_code: zipCode.trim(),
      });
      navigate("/landlord/properties");
    } catch (err) {
      setError(err?.message || "Failed to create property");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="fixed inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 w-full max-w-[800px] h-full max-h-[750px] flex flex-col rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <header className="flex items-center justify-between px-8 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-white p-1 rounded">
                <span className="material-symbols-outlined text-sm">domain</span>
              </div>
              <h2 className="text-lg font-bold tracking-tight">PropTrack</h2>
            </div>
            <button
              onClick={() => navigate("/landlord/properties")}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500"
              aria-label="Close"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </header>

          <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex justify-between items-start max-w-2xl mx-auto w-full relative">
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 z-0 mx-6"></div>
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider">Basic Info</p>
                  <p className="text-[10px] text-slate-500 font-medium">Active</p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  <span className="material-symbols-outlined text-lg">sell</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Units & Pricing</p>
                  <p className="text-[10px] text-slate-500">Next Step</p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  <span className="material-symbols-outlined text-lg">image</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Photos</p>
                  <p className="text-[10px] text-slate-500">Upcoming</p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center ring-4 ring-white dark:ring-slate-900">
                  <span className="material-symbols-outlined text-lg">task_alt</span>
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Review</p>
                  <p className="text-[10px] text-slate-500">Upcoming</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-8 py-10">
            <div className="max-w-xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Add New Property</h1>
                <p className="text-slate-500 dark:text-slate-400">
                  Enter the basic details to identify your property.
                </p>
              </div>

              {error ? <p className="mb-4 text-sm font-semibold text-red-600">{error}</p> : null}

              <form className="space-y-6" onSubmit={onSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1" htmlFor="property-name">
                    Property Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">apartment</span>
                    <input
                      id="property-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="e.g. Oakwood Apartments"
                      type="text"
                      required
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="address">
                    Street Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">location_on</span>
                    <input
                      id="address"
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="123 Main St, Suite 400"
                      type="text"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="city">City</label>
                    <input
                      id="city"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="Los Angeles"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="state">State</label>
                    <input
                      id="state"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="CA"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300" htmlFor="zip">ZIP Code</label>
                    <input
                      id="zip"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                      placeholder="90210"
                      type="text"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-3 tracking-wide">
                    Property Location Preview
                  </p>
                  <div className="w-full h-40 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 bg-slate-200 dark:bg-slate-700/50">
                      <span className="material-symbols-outlined text-slate-400 text-3xl">map</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Map view will update after address entry
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2"></div>

                <div className="hidden">
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>

          <footer className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
            <button
              onClick={() => navigate("/landlord/properties")}
              className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
              type="button"
            >
              Cancel
            </button>
            <div className="flex items-center gap-3">
              <button
                className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                disabled={!canSubmit}
                onClick={onSubmit}
                type="button"
              >
                {submitting ? "Creating..." : "Create Property"}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
