import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../store/auth";

function statusPill(status) {
  switch (status) {
    case "OCCUPIED":
      return {
        label: "Occupied",
        className:
          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400",
        dot: "bg-emerald-500",
      };
    case "MAINTENANCE":
      return {
        label: "Maintenance",
        className: "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
        dot: "bg-blue-500",
      };
    case "VACANT":
    default:
      return {
        label: "Vacant",
        className:
          "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
        dot: "bg-amber-500",
      };
  }
}

export default function LandlordPropertyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const access = useAuth((s) => s.access);
  const ensureAccess = useAuth((s) => s.ensureAccess);

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [photos, setPhotos] = useState([]);
  const [photosLoading, setPhotosLoading] = useState(false);

  const [assignOpen, setAssignOpen] = useState(false);
  const [tenantQuery, setTenantQuery] = useState("");
  const [tenantItems, setTenantItems] = useState([]);
  const [tenantLoading, setTenantLoading] = useState(false);
  const [tenantError, setTenantError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!access || !id) return;
      setLoading(true);
      setError("");
      try {
        const freshAccess = await ensureAccess();
        const data = await api.getProperty(freshAccess, id);
        if (!cancelled) setProperty(data);

        setPhotosLoading(true);
        const p = await api.listPropertyPhotos(freshAccess, id);
        if (!cancelled) setPhotos(Array.isArray(p) ? p : []);
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
  }, [access, id]);

  async function loadTenants(q = "") {
    if (!access) return;
    setTenantLoading(true);
    setTenantError("");
    try {
      const freshAccess = await ensureAccess();
      const data = await api.listTenants(freshAccess, q);
      setTenantItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setTenantError(e?.message || "Failed to load tenants");
    } finally {
      setTenantLoading(false);
    }
  }

  async function assignTenant(tenantId) {
    if (!access || !id) return;
    setTenantError("");
    try {
      const freshAccess = await ensureAccess();
      const updated = await api.assignTenant(freshAccess, id, { tenant_id: tenantId });
      setProperty(updated);
      setAssignOpen(false);
    } catch (e) {
      setTenantError(e?.message || "Failed to assign tenant");
    }
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <p className="text-slate-500">Loading property...</p>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Property not found"}</p>
          <button
            onClick={() => navigate("/landlord/properties")}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const pill = statusPill(property.status);
  const fullAddress = `${property.street_address}${property.city ? ", " + property.city : ""}${property.state ? ", " + property.state : ""} ${property.zip_code || ""}`;

  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 min-h-screen">
      <div className="flex flex-col min-h-screen w-full">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-[1440px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined !text-2xl">apartment</span>
              </div>
              <h1 className="text-xl font-bold tracking-tight">PropTrack</h1>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/landlord/properties")}
                className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Back to List
              </button>
              <button
                onClick={() => navigate(`/landlord/properties/${id}/edit`)}
                className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all"
              >
                <span className="material-symbols-outlined !text-lg">edit</span>
                Edit
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-[1440px] mx-auto w-full px-6 py-6">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm mb-4">
            <button
              onClick={() => navigate("/landlord/properties")}
              className="hover:text-primary transition-colors"
            >
              Properties
            </button>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-slate-900 dark:text-white font-medium">{property.name}</span>
          </div>

          {/* Page Title */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{property.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {fullAddress}
              </p>
            </div>
            <div className="flex gap-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${pill.className}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${pill.dot}`}></span>
                {pill.label}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200 dark:border-slate-800 mb-8">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 border-b-2 pb-3 font-bold text-sm transition-all ${
                  activeTab === "overview"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-sm">dashboard</span>
                Overview
              </button>
              <button
                onClick={() => setActiveTab("tenants")}
                className={`flex items-center gap-2 border-b-2 pb-3 font-bold text-sm transition-all ${
                  activeTab === "tenants"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-sm">group</span>
                Tenants
              </button>
              <button
                onClick={() => setActiveTab("financials")}
                className={`flex items-center gap-2 border-b-2 pb-3 font-bold text-sm transition-all ${
                  activeTab === "financials"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-sm">payments</span>
                Financials
              </button>
              <button
                onClick={() => setActiveTab("maintenance")}
                className={`flex items-center gap-2 border-b-2 pb-3 font-bold text-sm transition-all ${
                  activeTab === "maintenance"
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <span className="material-symbols-outlined text-sm">build</span>
                Maintenance
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left & Center Content */}
              <div className="lg:col-span-8 flex flex-col gap-8">
                {/* Photo Gallery */}
                <section>
                  {photosLoading ? (
                    <div className="h-[400px] rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                      <p className="text-slate-500 text-sm">Loading photos...</p>
                    </div>
                  ) : photos.length ? (
                    <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[400px]">
                      <div className="col-span-3 row-span-2 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                        <img src={photos[0].image_url} alt="Property" className="w-full h-full object-cover" />
                      </div>
                      <div className="col-span-1 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative">
                        {photos[1] ? (
                          <img src={photos[1].image_url} alt="Property" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-slate-400 text-3xl">image</span>
                          </div>
                        )}
                      </div>
                      <div className="col-span-1 rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex items-center justify-center">
                        {photos.length > 2 ? (
                          <span className="text-slate-900 dark:text-white font-black text-lg">+{photos.length - 2}</span>
                        ) : (
                          <span className="text-slate-500 font-bold text-sm">Photos</span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="h-[400px] rounded-xl bg-slate-200 dark:bg-slate-800 overflow-hidden relative flex flex-col items-center justify-center">
                      <span className="material-symbols-outlined text-slate-400 text-6xl">image</span>
                      <p className="text-slate-500 text-sm mt-2">No photos uploaded yet</p>
                    </div>
                  )}
                </section>

                {/* Property Details */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Property Details</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Total Units</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">{property.units || 0}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Monthly Rent</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${Number(property.monthly_rent || 0).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Potential Revenue</p>
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${((property.units || 0) * Number(property.monthly_rent || 0)).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">{pill.label}</p>
                    </div>
                  </div>
                </section>

                {/* Location Map Placeholder */}
                <section className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Location</h3>
                    <button className="text-primary text-sm font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                      Maps
                    </button>
                  </div>
                  <div className="w-full aspect-video rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 relative flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-400 text-6xl">map</span>
                  </div>
                </section>
              </div>

              {/* Right Sidebar: Quick Stats */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-6">
                    Property Insights
                  </h3>

                  {/* Stat Card 1 */}
                  <div className="flex items-start gap-4 mb-8">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <span className="material-symbols-outlined text-2xl">bed</span>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Occupancy Rate</p>
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">N/A</h4>
                      <p className="text-xs text-slate-400 mt-2">Unit-level occupancy not implemented yet</p>
                    </div>
                  </div>

                  {/* Stat Card 2 */}
                  <div className="flex items-start gap-4 mb-8">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <span className="material-symbols-outlined text-2xl">trending_up</span>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Monthly Revenue</p>
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                        ${((property.units || 0) * Number(property.monthly_rent || 0)).toLocaleString()}
                      </h4>
                      <p className="text-xs text-slate-400 mt-2">At full occupancy</p>
                    </div>
                  </div>

                  {/* Stat Card 3 */}
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg text-primary">
                      <span className="material-symbols-outlined text-2xl">confirmation_number</span>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Open Tickets</p>
                      <h4 className="text-2xl font-bold text-slate-900 dark:text-white">N/A</h4>
                      <p className="text-xs text-slate-400 mt-2">Maintenance module not implemented yet</p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h3>

                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned Tenant</p>
                    <p className="text-sm font-semibold mt-1">
                      {property.tenant_username ? property.tenant_username : "None"}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setAssignOpen(true);
                        loadTenants(tenantQuery);
                      }}
                      className="w-full py-2 px-4 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
                    >
                      Assign Tenant
                    </button>
                    {property.tenant ? (
                      <button
                        onClick={() => assignTenant(null)}
                        className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        Unassign Tenant
                      </button>
                    ) : null}
                    <button className="w-full py-2 px-4 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      Create Maintenance Request
                    </button>
                  </div>

                  {assignOpen ? (
                    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4" onClick={() => setAssignOpen(false)}>
                      <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-extrabold">Assign Tenant</h4>
                          <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setAssignOpen(false)}>
                            <span className="material-symbols-outlined">close</span>
                          </button>
                        </div>

                        {tenantError ? <p className="text-sm font-semibold text-red-600 mb-3">{tenantError}</p> : null}

                        <div className="flex gap-2 mb-4">
                          <input
                            value={tenantQuery}
                            onChange={(e) => setTenantQuery(e.target.value)}
                            placeholder="Search tenant by username/email..."
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                          />
                          <button
                            onClick={() => loadTenants(tenantQuery)}
                            className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-bold"
                          >
                            Search
                          </button>
                        </div>

                        <div className="max-h-72 overflow-y-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                          {tenantLoading ? (
                            <div className="p-4 text-sm text-slate-500">Loading...</div>
                          ) : tenantItems.length === 0 ? (
                            <div className="p-4 text-sm text-slate-500">No tenants found.</div>
                          ) : (
                            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                              {tenantItems.map((t) => (
                                <li key={t.id} className="p-4 flex items-center justify-between gap-4">
                                  <div>
                                    <p className="text-sm font-bold">{t.username}</p>
                                    <p className="text-xs text-slate-500">{t.email}</p>
                                  </div>
                                  <button
                                    onClick={() => assignTenant(t.id)}
                                    className="px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20"
                                  >
                                    Assign
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}

          {activeTab === "tenants" && (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="mx-auto w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-3xl">group</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Tenants Assigned</h3>
              <p className="text-sm text-slate-500 mb-6">Assign tenants to this property to track occupancy and rent payments.</p>
              <button
                onClick={() => {
                  setAssignOpen(true);
                  loadTenants(tenantQuery);
                }}
                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
              >
                Assign Tenant
              </button>
            </div>
          )}

          {activeTab === "financials" && (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="mx-auto w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-3xl">payments</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Financial Data</h3>
              <p className="text-sm text-slate-500">Detailed financial tracking coming in Week 3.</p>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="bg-white dark:bg-slate-900 p-10 rounded-xl border border-slate-200 dark:border-slate-800 text-center">
              <div className="mx-auto w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-slate-400 text-3xl">build</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Maintenance Requests</h3>
              <p className="text-sm text-slate-500 mb-6">Create a maintenance request to track repairs and issues.</p>
              <button className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors">
                Create Request
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
