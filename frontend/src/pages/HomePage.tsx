import { ConnectionTest } from '../components/ConnectionTest.tsx'

export function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-wide text-blue-800">EnterpriseERP</span>
          <span className="text-xs font-medium uppercase tracking-widest text-slate-500">
            Development preview
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">
          Enterprise resource planning
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
          EnterpriseERP
        </h1>
        <p className="mt-5 max-w-2xl text-2xl leading-snug text-slate-700 sm:text-3xl">
          One Platform. Every Department.
        </p>
        <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
          A centralized platform for company operations. This preview confirms the web application
          can reach the API.
        </p>

        <section className="mt-12 max-w-xl rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-slate-950">API connection</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Uses the address in VITE_API_BASE_URL. No account or database is required.
          </p>
          <div className="mt-5">
            <ConnectionTest />
          </div>
        </section>
      </main>
    </div>
  )
}
