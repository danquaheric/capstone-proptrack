import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
        <div className="layout-container flex h-full grow flex-col">
          {/* Top Navigation Bar */}
          <header className="sticky top-0 z-50 w-full border-b border-solid border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 lg:px-20 py-4">
            <div className="mx-auto flex max-w-7xl items-center justify-between">
              <div className="flex items-center gap-2 text-primary">
                <span className="material-symbols-outlined text-3xl font-bold">domain</span>
                <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">PropTrack</h2>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#features">
                  Features
                </a>
                <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#pricing">
                  Pricing
                </a>
                <a className="text-sm font-medium text-slate-600 hover:text-primary dark:text-slate-400 dark:hover:text-white transition-colors" href="#about">
                  About
                </a>
              </nav>
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="hidden sm:flex h-10 items-center justify-center rounded-lg px-4 text-sm font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="flex h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">
            {/* Hero */}
            <section className="mx-auto max-w-7xl px-6 lg:px-20 py-16 lg:py-24">
              <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-16">
                <div className="flex flex-1 flex-col gap-8 text-center lg:text-left">
                  <div className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                    <span className="material-symbols-outlined text-sm">auto_awesome</span>
                    New: AI Maintenance Insights
                  </div>

                  <h1 className="text-4xl font-black leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl">
                    Manage Properties, <span className="text-primary">Track Rent</span>, Simplify Life.
                  </h1>

                  <p className="max-w-xl text-lg font-normal leading-relaxed text-slate-600 dark:text-slate-400 mx-auto lg:mx-0">
                    The all-in-one platform for landlords and tenants to automate payments, handle maintenance, and stay organized without the stress.
                  </p>

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                    <Link
                      to="/register"
                      className="flex h-14 min-w-[180px] items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-xl shadow-primary/25 hover:scale-[1.02] active:scale-100 transition-all"
                    >
                      Get Started Free
                    </Link>
                    <button className="flex h-14 min-w-[180px] items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-8 text-base font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                      Watch Demo
                    </button>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                    <div className="flex -space-x-2">
                      <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-300" />
                      <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-400" />
                      <div className="h-8 w-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-500">Trusted by 10k+ Landlords</p>
                  </div>
                </div>

                <div className="flex flex-1 justify-center w-full max-w-[580px]">
                  <div className="relative w-full aspect-[4/3] rounded-2xl bg-gradient-to-tr from-primary/20 to-blue-400/20 p-2 border border-white/50 dark:border-slate-800 shadow-2xl overflow-hidden group">
                    <div className="w-full h-full rounded-xl bg-white dark:bg-slate-900 shadow-inner flex items-center justify-center">
                      <img
                        alt="Modern property dashboard interface"
                        className="w-full h-full object-cover rounded-xl opacity-90 group-hover:scale-105 transition-transform duration-700"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDD9Z4nbvGU2Jp6IDq5jXoOw2LGDMJNOdrYZEp3wB47h5L2X4WWYpemv_tX0Fhropfix7tgOfO2On64qUBMzFb8w5-Q9iX6Mu4K9RKCXGqxDhvTePRJBjfMFkTH9cB8Hrz-wLTXgroqSr-rcv7bIqFMZcVyPsXjHfJZuolyYguAB2qdU0oSpeAS5eonjDlxI6bMkjfqUz0-DElvEKOHF9Yf-83g_lLQXtDqwmzKBVjToQyzcu3awMDDxHcUV60zSogIL5xfb5MdSus"
                      />
                    </div>
                    <div className="absolute -bottom-4 -left-4 p-4 rounded-lg bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 max-w-[180px]">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Rent Paid</span>
                      </div>
                      <p className="text-lg font-bold text-slate-900 dark:text-white">$2,450.00</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Features */}
            <section id="features" className="bg-slate-50/50 dark:bg-slate-900/30 py-20">
              <div className="mx-auto max-w-7xl px-6 lg:px-20">
                <div className="mb-16 flex flex-col gap-4 text-center">
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                    Designed for Modern Property Management
                  </h2>
                  <p className="mx-auto max-w-2xl text-base text-slate-600 dark:text-slate-400">
                    Everything you need to manage your portfolio, whether you're a single-unit landlord or an enterprise property manager.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <span className="material-symbols-outlined">payments</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Automated Rent Tracking</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Get real-time notifications when rent is paid. Automatically generate invoices and track historical records effortlessly.
                      </p>
                    </div>
                    <a className="mt-auto inline-flex items-center text-sm font-bold text-primary hover:underline" href="#">
                      Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </a>
                  </div>

                  <div className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <span className="material-symbols-outlined">handyman</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Maintenance Management</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Streamline repair requests with photo uploads and direct messaging. Coordinate with contractors within the app.
                      </p>
                    </div>
                    <a className="mt-auto inline-flex items-center text-sm font-bold text-primary hover:underline" href="#">
                      Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </a>
                  </div>

                  <div className="group flex flex-col gap-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                      <span className="material-symbols-outlined">badge</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Role-Based Access</h3>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                        Tailored dashboards for Landlords, Tenants, and Admins to ensure privacy, security, and focused workflows.
                      </p>
                    </div>
                    <a className="mt-auto inline-flex items-center text-sm font-bold text-primary hover:underline" href="#">
                      Learn more <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <section className="mx-auto max-w-7xl px-6 lg:px-20 py-20">
              <div className="relative overflow-hidden rounded-[2.5rem] bg-slate-900 px-8 py-16 text-center shadow-2xl dark:bg-primary/5">
                <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
                <div className="absolute -right-20 -bottom-20 h-64 w-64 rounded-full bg-blue-400/20 blur-[100px]" />
                <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-6">
                  <h2 className="text-3xl font-black text-white sm:text-5xl leading-tight">Ready to simplify your property management?</h2>
                  <p className="text-lg text-slate-300 dark:text-slate-400">Join 10,000+ happy landlords and tenants today. No credit card required to start.</p>
                  <div className="mt-4 flex flex-wrap justify-center gap-4">
                    <Link
                      to="/register"
                      className="flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-white shadow-xl shadow-primary/40 hover:scale-105 transition-all"
                    >
                      Get Started for Free
                    </Link>
                    <button className="flex h-14 min-w-[200px] items-center justify-center rounded-xl bg-white px-8 text-base font-bold text-slate-900 hover:bg-slate-100 transition-all">
                      Contact Sales
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </main>

          <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-background-dark py-12 lg:py-16">
            <div className="mx-auto max-w-7xl px-6 lg:px-20">
              <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-2 text-primary">
                    <span className="material-symbols-outlined text-3xl font-bold">domain</span>
                    <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">PropTrack</h2>
                  </div>
                  <p className="max-w-xs text-sm text-slate-500">Making property management accessible, digital, and automated for everyone.</p>
                </div>

                <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Product</h4>
                    <nav className="flex flex-col gap-2">
                      <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#features">Features</a>
                      <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#pricing">Pricing</a>
                      <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Integrations</a>
                    </nav>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Company</h4>
                    <nav className="flex flex-col gap-2">
                      <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#about">About</a>
                      <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Careers</a>
                      <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Blog</a>
                    </nav>
                  </div>
                  <div className="flex flex-col gap-4">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">Social</h4>
                    <div className="flex gap-4 text-slate-500">
                      <a className="hover:text-primary transition-colors" href="#">Twitter</a>
                      <a className="hover:text-primary transition-colors" href="#">LinkedIn</a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-slate-200 dark:border-slate-800 pt-8 sm:flex-row">
                <p className="text-xs text-slate-400">© 2024 PropTrack SaaS. All rights reserved.</p>
                <div className="flex gap-6">
                  <a className="text-xs text-slate-400 hover:text-primary" href="#">Privacy Policy</a>
                  <a className="text-xs text-slate-400 hover:text-primary" href="#">Terms of Service</a>
                  <a className="text-xs text-slate-400 hover:text-primary" href="#">Cookies</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
