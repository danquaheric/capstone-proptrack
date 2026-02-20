import { Link } from "react-router-dom";

export default function AccessDenied() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-extrabold">Access denied</h1>
        <p className="mt-2 text-slate-500">You don’t have permission to view that page.</p>
        <Link to="/" className="inline-flex mt-6 rounded-xl bg-primary text-white font-bold px-5 py-3">
          Go Home
        </Link>
      </div>
    </div>
  );
}
