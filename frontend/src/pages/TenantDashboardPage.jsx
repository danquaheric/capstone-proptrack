export default function TenantDashboardPage() {
  // UI is currently static placeholders; data wiring comes in Week 3.
  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8">
      {/* Center */}
      <div className="col-span-12 lg:col-span-8 space-y-8">
        {/* Rent Card */}
        <section className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-slate-100 relative min-h-[160px]">
              <img
                alt="Property View"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnlVfxkV5NLC1YRYDgudbnKFMz5kP8EzNx9HNZ8MXO6kBw0xHTpDqIeV7LB_ylHMwSlE-gjJDL0YUz0gJQfw2WJE28zs4lbHFRwK9Q2yvuo3C-FJpel62dq0JlPeX0GgiO31fjbE55UhK8zl3Q5h7MKxVIVwitNnVMaNPzAx9G4HpmfSQnPZF07oGZ1iuKb_E4Y7qg7N4Q75DrgwueXaVQs7eLHvfe3gpKW6XlTIokpkNyRov0d1lbdJ2Xxz10YaljoHqnlfksARY"
              />
            </div>
            <div className="p-6 md:p-8 flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Upcoming Payment</p>
                  <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1">$1,850.00</h3>
                </div>
                <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight">Due in 5 days</div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  <span className="text-sm">Next Rent Due: Oct 1st, 2023</span>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center gap-2" type="button">
                  Pay Now <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Payment History */}
        <section>
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-lg font-bold">Payment History</h3>
            <a className="text-primary text-sm font-semibold hover:underline" href="#" onClick={(e) => e.preventDefault()}>
              View All
            </a>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {[
                  { date: "Sep 01, 2023", amount: "$1,850.00", method: "Bank Transfer" },
                  { date: "Aug 01, 2023", amount: "$1,850.00", method: "Bank Transfer" },
                  { date: "Jul 01, 2023", amount: "$1,850.00", method: "Bank Transfer" },
                ].map((row) => (
                  <tr key={row.date} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium">{row.date}</td>
                    <td className="px-6 py-4 text-sm font-bold">{row.amount}</td>
                    <td className="px-6 py-4 text-sm text-slate-500">{row.method}</td>
                    <td className="px-6 py-4 text-right">
                      <span className="inline-flex items-center gap-1.5 bg-success/10 text-success px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-success" /> Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Right */}
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-6">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-white text-2xl">home_repair_service</span>
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Maintenance Issue?</h4>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-2 mb-6">
            Submit a request and we&apos;ll send a technician over as soon as possible.
          </p>
          <button
            type="button"
            className="w-full bg-white dark:bg-slate-800 text-primary border border-primary/20 font-bold py-2.5 px-4 rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm"
          >
            Request Maintenance
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-6">
          <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">Recent Notifications</h4>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 shrink-0 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">water_drop</span>
              </div>
              <div>
                <p className="text-sm font-medium">Water Maintenance</p>
                <p className="text-xs text-slate-500">Water will be shut off on Friday from 10 AM to 2 PM.</p>
                <span className="text-[10px] text-slate-400 mt-1 block uppercase">2 hours ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 shrink-0 bg-success/10 text-success rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
              </div>
              <div>
                <p className="text-sm font-medium">Payment Received</p>
                <p className="text-xs text-slate-500">Your payment for September has been confirmed.</p>
                <span className="text-[10px] text-slate-400 mt-1 block uppercase">3 days ago</span>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 shrink-0 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">mail</span>
              </div>
              <div>
                <p className="text-sm font-medium">New Lease Update</p>
                <p className="text-xs text-slate-500">The management has uploaded new lease guidelines.</p>
                <span className="text-[10px] text-slate-400 mt-1 block uppercase">1 week ago</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl" />
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Your Property</h4>
          <p className="text-xl font-bold">The Heights #402</p>
          <p className="text-sm text-slate-400">1200 Sunset Blvd, Los Angeles</p>
          <div className="mt-6 flex items-center gap-4 text-xs font-medium text-slate-300">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bed</span> 2 Bed
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">bathtub</span> 1.5 Bath
            </div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">square_foot</span> 950 sqft
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
