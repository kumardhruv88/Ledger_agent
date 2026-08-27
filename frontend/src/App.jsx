import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white shadow-sm border border-silver rounded-xl p-8">
        <header className="mb-8 border-b border-silver pb-4">
          <h1 className="text-3xl font-semibold tracking-tight text-ink">Ledger</h1>
          <p className="text-slate mt-2 text-sm">
            A fully local multi-agent data analyst that turns a CSV into insights — and refuses to report the ones that statistics cannot support.
          </p>
        </header>

        <main className="space-y-6">
          <div className="bg-pearl p-6 rounded-lg border border-silver border-dashed flex flex-col items-center justify-center text-center">
            <p className="text-slate mb-4">Upload a dataset to begin</p>
            <button className="bg-royal hover:bg-blue-900 text-white font-medium py-2 px-6 rounded-md transition-colors shadow-sm">
              Select CSV
            </button>
          </div>

          <div className="space-y-4">
            <h2 className="font-medium text-lg text-ink">Analysis Ledger</h2>
            
            <div className="border border-silver rounded-lg overflow-hidden">
              <div className="bg-pearl px-4 py-3 flex justify-between items-center border-b border-silver">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-medium text-slate bg-white px-2 py-1 rounded border border-silver">H01</span>
                  <span className="text-sm font-medium text-ink">Tenure differs between churned and retained customers</span>
                </div>
                <span className="text-xs font-semibold text-emerald bg-green-50 px-2 py-1 rounded-full border border-green-200">
                  SUPPORTED
                </span>
              </div>
              <div className="p-4 bg-white text-sm">
                <div className="font-mono text-xs bg-slate-50 p-3 rounded border border-silver text-slate-700 overflow-x-auto mb-4">
                  df.groupby('churn')['tenure'].describe()
                </div>
                <p className="text-ink">
                  <span className="font-semibold text-royal">Conclusion:</span> Churned customers have substantially shorter tenure (median 10 vs 38 months, r = 0.44).
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
