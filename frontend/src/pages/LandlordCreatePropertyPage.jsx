import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

export default function LandlordCreatePropertyPage() {
  const navigate = useNavigate();
  const access = useAuth((s) => s.access);
  const ensureAccess = useAuth((s) => s.ensureAccess);

  const [step, setStep] = useState(0); // 0=Basic, 1=Units, 2=Photos, 3=Review

  const [name, setName] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [units, setUnits] = useState("");
  const [monthlyRent, setMonthlyRent] = useState("");

  const [photos, setPhotos] = useState([]);

  const [submitting, setSubmitting] = useState(false);
  const [submittingMsg, setSubmittingMsg] = useState("");
  const [error, setError] = useState("");

  const basicValid = Boolean(name.trim() && streetAddress.trim());
  const unitsValid = true; // optional fields for now
  const photosValid = true; // optional

  const canNext =
    !submitting &&
    ((step === 0 && basicValid) || (step === 1 && unitsValid) || (step === 2 && photosValid));

  const canSubmit = !submitting && basicValid;

  function nextStep() {
    if (!canNext) return;
    setError("");
    setStep((s) => Math.min(3, s + 1));
  }

  function prevStep() {
    if (submitting) return;
    setError("");
    setStep((s) => Math.max(0, s - 1));
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!access) return;

    // Prevent accidental submit before Review step
    if (step !== 3) {
      nextStep();
      return;
    }

    setSubmitting(true);
    setSubmittingMsg("Creating property...");
    setError("");
    try {
      const freshAccess = await ensureAccess();
      const rentValue = parseFloat(String(monthlyRent).replace(/[^0-9.]/g, "")) || 0;
      const created = await api.createProperty(freshAccess, {
        name: name.trim(),
        street_address: streetAddress.trim(),
        city: city.trim(),
        state: state.trim(),
        zip_code: zipCode.trim(),
        units: parseInt(units, 10) || 0,
        monthly_rent: rentValue,
      });

      // Upload photos (optional)
      if (created?.id && photos.length) {
        for (let i = 0; i < photos.length; i++) {
          const file = photos[i];
          setSubmittingMsg(`Uploading photos (${i + 1}/${photos.length})...`);
          await api.uploadPropertyPhoto(freshAccess, created.id, file, { sort_order: i });
        }
      }

      navigate(`/landlord/properties/${created.id}`);
    } catch (err) {
      setError(err?.message || "Failed to create property");
    } finally {
      setSubmitting(false);
      setSubmittingMsg("");
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
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${
                    step === 0
                      ? "bg-primary text-white"
                      : step > 0
                        ? "bg-emerald-600 text-white"
                        : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold uppercase tracking-wider ${step === 0 ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                    Basic Info
                  </p>
                  <p className="text-[10px] text-slate-500 font-medium">{step === 0 ? "Active" : step > 0 ? "Done" : "Upcoming"}</p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${
                    step === 1
                      ? "bg-primary text-white"
                      : step > 1
                        ? "bg-emerald-600 text-white"
                        : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">sell</span>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold uppercase tracking-wider ${step === 1 ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                    Units & Pricing
                  </p>
                  <p className="text-[10px] text-slate-500">{step === 1 ? "Active" : step > 1 ? "Done" : "Next Step"}</p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${
                    step === 2
                      ? "bg-primary text-white"
                      : step > 2
                        ? "bg-emerald-600 text-white"
                        : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">image</span>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold uppercase tracking-wider ${step === 2 ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                    Photos
                  </p>
                  <p className="text-[10px] text-slate-500">{step === 2 ? "Active" : step > 2 ? "Done" : "Upcoming"}</p>
                </div>
              </div>
              <div className="relative z-10 flex flex-col items-center gap-2 group">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-900 ${
                    step === 3
                      ? "bg-primary text-white"
                      : "bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-400"
                  }`}
                >
                  <span className="material-symbols-outlined text-lg">task_alt</span>
                </div>
                <div className="text-center">
                  <p className={`text-xs font-bold uppercase tracking-wider ${step === 3 ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                    Review
                  </p>
                  <p className="text-[10px] text-slate-500">{step === 3 ? "Active" : "Upcoming"}</p>
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
                {/* STEP 0: BASIC INFO */}
                {step === 0 ? (
                  <>
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
                  </>
                ) : null}

                {/* STEP 1: UNITS & PRICING */}
                {step === 1 ? (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">sell</span>
                      Units & Pricing
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2" htmlFor="units">
                          <span className="material-symbols-outlined text-sm text-slate-400">apartment</span>
                          Number of Units
                        </label>
                        <input
                          id="units"
                          type="number"
                          min={1}
                          value={units}
                          onChange={(e) => setUnits(e.target.value)}
                          className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                          placeholder="e.g. 1"
                        />
                        <p className="text-xs text-slate-500">Total leasable spaces in this property.</p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2" htmlFor="monthlyRent">
                          <span className="material-symbols-outlined text-sm text-slate-400">payments</span>
                          Monthly Rent per Unit
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                          <input
                            id="monthlyRent"
                            type="text"
                            value={monthlyRent}
                            onChange={(e) => setMonthlyRent(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                            placeholder="1,500"
                          />
                        </div>
                        <p className="text-xs text-slate-500">Base monthly rate for a standard unit.</p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* STEP 2: PHOTOS (placeholder) */}
                {step === 2 ? (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">image</span>
                      Photos
                    </p>

                    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">Upload property photos</p>
                          <p className="text-xs text-slate-500 mt-1">PNG/JPG/WebP. You can upload multiple photos.</p>
                        </div>
                        <label className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold cursor-pointer hover:bg-blue-700">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => {
                              const files = Array.from(e.target.files || []);
                              if (files.length) setPhotos((prev) => [...prev, ...files]);
                              e.target.value = "";
                            }}
                          />
                          Add Photos
                        </label>
                      </div>

                      {photos.length ? (
                        <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
                          {photos.map((file, idx) => {
                            const url = URL.createObjectURL(file);
                            return (
                              <div key={`${file.name}-${idx}`} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
                                <img src={url} alt={file.name} className="w-full h-28 object-cover" onLoad={() => URL.revokeObjectURL(url)} />
                                <button
                                  type="button"
                                  onClick={() => setPhotos((prev) => prev.filter((_, i) => i !== idx))}
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
                      ) : (
                        <div className="mt-4 p-6 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-center">
                          <p className="text-sm text-slate-600 dark:text-slate-300 font-semibold">No photos selected</p>
                          <p className="text-xs text-slate-500 mt-1">You can skip this step and add photos later.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* STEP 3: REVIEW */}
                {step === 3 ? (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">task_alt</span>
                      Review
                    </p>
                    <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      <div className="p-5 bg-white dark:bg-slate-900">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Property Name</p>
                            <p className="font-semibold mt-1">{name || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Street Address</p>
                            <p className="font-semibold mt-1">{streetAddress || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">City / State / ZIP</p>
                            <p className="font-semibold mt-1">{[city, state, zipCode].filter(Boolean).join(", ") || "—"}</p>
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-500 uppercase">Units / Monthly Rent</p>
                            <p className="font-semibold mt-1">
                              {(units ? `${units} units` : "—")}{monthlyRent ? ` • $${monthlyRent}` : ""}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 text-xs text-slate-500">
                        Click “Create Property” to save this property.
                      </div>
                    </div>
                  </div>
                ) : null}

                <div className="hidden">
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          </div>

          <footer className="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/landlord/properties")}
                className="px-6 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                type="button"
              >
                Cancel
              </button>
              {step > 0 ? (
                <button
                  onClick={prevStep}
                  className="px-6 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  type="button"
                >
                  Back
                </button>
              ) : null}
            </div>

            <div className="flex items-center gap-3">
              {step < 3 ? (
                <button
                  className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                  disabled={!canNext}
                  onClick={nextStep}
                  type="button"
                >
                  Next
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              ) : (
                <button
                  className="bg-primary hover:bg-primary/90 disabled:opacity-60 text-white px-8 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary/20"
                  disabled={!canSubmit}
                  onClick={onSubmit}
                  type="button"
                >
                  {submitting ? (submittingMsg || "Creating...") : "Create Property"}
                  <span className="material-symbols-outlined text-sm">task_alt</span>
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
