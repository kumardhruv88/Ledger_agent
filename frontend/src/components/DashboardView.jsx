import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { cn } from '../lib/utils';
import { ShieldCheck, CheckCircle2, XCircle } from 'lucide-react';

export default function DashboardView({ sessionId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sessionId) return;
    
    const fetchReport = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/sessions/${sessionId}/report`);
        if (!res.ok) throw new Error('Failed to load report');
        
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-xl">
        Error loading dashboard: {error}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Integrity Badge */}
      <div className="glass-panel p-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ShieldCheck className={cn("w-10 h-10", data.report_validated ? "text-emerald-400" : "text-red-400")} />
          <div>
            <h2 className="text-xl font-bold">Scientific Integrity Check</h2>
            <p className="text-sm text-gray-400">
              {data.report_validated 
                ? "Report passed A7 Adversarial Audit. No causal language or overstatements detected." 
                : "Report failed audit. See violations below."}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Reproducibility Hash</div>
          <div className="font-mono text-sm bg-black/40 px-3 py-1 rounded border border-white/5">
            {data.reproducibility_hash.substring(0, 16)}...
          </div>
        </div>
      </div>

      {/* Visualizations (if any) */}
      {data.visualization_dashboard && data.visualization_dashboard.charts.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {data.visualization_dashboard.charts.map((chart, i) => {
            const chartData = JSON.parse(chart.plotly_json);
            return (
              <div key={i} className="glass-panel p-4 overflow-hidden">
                <h3 className="text-lg font-semibold mb-1 ml-4">{chart.title}</h3>
                <p className="text-sm text-gray-400 mb-4 ml-4">{chart.description}</p>
                <div className="w-full bg-[#111113] rounded-lg">
                  <Plot
                    data={chartData.data}
                    layout={{
                      ...chartData.layout,
                      autosize: true,
                      paper_bgcolor: 'transparent',
                      plot_bgcolor: 'transparent',
                      font: { color: '#9ca3af' },
                      xaxis: { gridcolor: '#1f2937', zerolinecolor: '#1f2937' },
                      yaxis: { gridcolor: '#1f2937', zerolinecolor: '#1f2937' },
                      margin: { t: 10, r: 10, l: 40, b: 40 }
                    }}
                    useResizeHandler={true}
                    className="w-full h-[300px]"
                    config={{ displayModeBar: false }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Ledger */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xl font-bold mb-4">Frozen Ledger</h3>
          <div className="space-y-3">
            {data.ledger_entries.map(entry => (
              <div key={entry.id} className="glass-panel p-4 text-sm">
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">
                    {entry.id}
                  </span>
                  {entry.status === 'SUPPORTED' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-500" />
                  )}
                </div>
                <p className="mt-2 text-gray-200">{entry.statement}</p>
                {entry.statistical_result && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Test:</span>
                      <span className="text-gray-300">{entry.statistical_result.test_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">p-value (FDR):</span>
                      <span className="text-gray-300 font-mono">
                        {entry.statistical_result.fdr_adjusted_p_value.toExponential(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Effect:</span>
                      <span className="text-gray-300">
                        {entry.statistical_result.effect_size_label}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Final Report */}
        <div className="lg:col-span-2">
          <div className="glass-panel p-8 prose prose-invert prose-blue max-w-none">
            <div dangerouslySetInnerHTML={{ __html: data.report_html }} />
          </div>
        </div>
      </div>

    </div>
  );
}
