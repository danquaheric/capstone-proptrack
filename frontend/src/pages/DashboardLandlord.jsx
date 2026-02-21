import { Link } from "react-router-dom";

export default function DashboardLandlord() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-extrabold">Landlord Dashboard</h1>
      <p className="mt-2 text-slate-500">Welcome back. Manage your properties from here.</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/landlord/properties"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-lg bg-primary text-white text-sm font-bold hover:bg-blue-700 shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined !text-lg">apartment</span>
          View Properties
        </Link>

        <Link
          to="/landlord/properties/new"
          className="inline-flex items-center gap-2 px-5 h-11 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
        >
          <span className="material-symbols-outlined !text-lg">add</span>
          Add Property
        </Link>
      </div>
    </div>
  );
}
