import React, { useState, useEffect } from 'react';
import { Terminal, Activity, Zap, ShieldAlert, Cpu } from 'lucide-react';

export default function TelemetryView({ sessionId }) {
  const [logs, setLogs] = useState([]);
  const [metrics, setMetrics] = useState({
    tokens: 0,
    latency: '0ms',
    hallucinations: 0,
    status: 'Idle'
  });

  // Mock telemetry stream for visual demonstration
  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      count++;
      const newLog = {
        id: count,
        time: new Date().toLocaleTimeString(),
        agent: ['A1 Profiler', 'A2 Proposer', 'A4 Executor'][Math.floor(Math.random() * 3)],
        action: ['Generating Hypothesis', 'Validating Schema', 'Executing Pandas', 'Applying FDR'][Math.floor(Math.random() * 4)],
        status: Math.random() > 0.8 ? 'WARN' : 'INFO'
      };
      
      setLogs(prev => [newLog, ...prev].slice(0, 50));
      setMetrics({
        tokens: Math.floor(Math.random() * 5000) + 12000,
        latency: Math.floor(Math.random() * 200 + 400) + 'ms',
        hallucinations: 0,
        status: 'Processing'
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
          <Terminal className="w-6 h-6 text-[#10b981]" />
          LangSmith Telemetry
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
          Live Stream
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Tokens', value: metrics.tokens.toLocaleString(), icon: Zap, color: 'text-yellow-400' },
          { label: 'Avg Latency', value: metrics.latency, icon: Activity, color: 'text-blue-400' },
          { label: 'Active Agent', value: 'A4 Executor', icon: Cpu, color: 'text-purple-400' },
          { label: 'Hallucinations', value: metrics.hallucinations, icon: ShieldAlert, color: 'text-emerald-400' }
        ].map((metric, i) => (
          <div key={i} className="glass-panel p-5 flex flex-col space-y-1">
            <div className="flex items-center gap-2 text-gray-400 mb-2">
              <metric.icon className={`w-4 h-4 ${metric.color}`} />
              <span className="text-xs font-medium uppercase tracking-wider">{metric.label}</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">{metric.value}</span>
          </div>
        ))}
      </div>

      {/* Terminal Log Output */}
      <div className="flex-1 glass-panel flex flex-col overflow-hidden min-h-[400px]">
        <div className="bg-black/40 border-b border-white/5 px-4 py-2 flex items-center justify-between">
          <span className="text-xs font-mono text-gray-500">ledger-execution-trace.log</span>
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 font-mono text-sm space-y-2 custom-scrollbar">
          {logs.map(log => (
            <div key={log.id} className="flex items-start gap-4 hover:bg-white/5 p-1 rounded transition-colors">
              <span className="text-gray-600 min-w-[80px]">{log.time}</span>
              <span className={`min-w-[50px] font-bold ${log.status === 'WARN' ? 'text-yellow-500' : 'text-[#0ea5e9]'}`}>
                [{log.status}]
              </span>
              <span className="text-purple-400 min-w-[120px]">{log.agent}</span>
              <span className="text-gray-300">{log.action}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="text-gray-500 italic">Waiting for telemetry stream...</div>
          )}
        </div>
      </div>
    </div>
  );
}
