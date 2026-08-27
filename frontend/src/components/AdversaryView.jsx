import React from 'react';
import { Target, GitMerge, FileX, Sparkles, BrainCircuit } from 'lucide-react';
import { cn } from '../lib/utils';

export default function AdversaryView({ sessionId }) {
  // Mock data for the self-improving loop visualization
  const evaluations = [
    { id: 1, type: 'Hallucination', severity: 'high', description: 'A6 asserted causation without experimental design.', fix: 'Injected constraints into A2 Proposer to reject causal hypotheses.' },
    { id: 2, type: 'P-Hacking', severity: 'medium', description: 'A5 ran multiple tests without FDR correction.', fix: 'Updated A4 Executor environment to automatically apply Benjamini-Hochberg.' },
  ];

  return (
    <div className="w-full h-full flex flex-col space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white flex items-center gap-3">
            <Target className="w-6 h-6 text-[#ef4444]" />
            A7 Adversary Dashboard
          </h2>
          <p className="text-[#a0a0a0] text-sm mt-1">Autonomous Self-Improving Evaluation Loop</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium">
          <BrainCircuit className="w-4 h-4 animate-pulse" />
          Active Auditing
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Recent Detections */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <FileX className="w-5 h-5 text-gray-400" />
            Recent Violations Detected
          </h3>
          <div className="space-y-4">
            {evaluations.map((evalItem) => (
              <div key={evalItem.id} className="glass-panel p-5 relative overflow-hidden group">
                <div className={`absolute top-0 left-0 w-1 h-full ${evalItem.severity === 'high' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-white">{evalItem.type}</span>
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded uppercase font-bold",
                    evalItem.severity === 'high' ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"
                  )}>
                    {evalItem.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-300 mb-4">{evalItem.description}</p>
                
                <div className="bg-black/30 rounded-md p-3 border border-white/5">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1">
                    <Sparkles className="w-3 h-3" />
                    Auto-Correction Applied
                  </div>
                  <p className="text-xs text-gray-400">{evalItem.fix}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Prompt Fine-Tuning Diff */}
        <div className="flex flex-col space-y-4">
          <h3 className="text-lg font-medium text-white flex items-center gap-2">
            <GitMerge className="w-5 h-5 text-gray-400" />
            Live Prompt Fine-Tuning
          </h3>
          
          <div className="glass-panel flex-1 flex flex-col overflow-hidden">
            <div className="bg-black/40 border-b border-white/5 px-4 py-3 flex items-center justify-between">
              <span className="text-xs font-mono text-gray-400">A2_Proposer_System_Prompt.txt</span>
              <span className="text-xs text-gray-500">v2.4.1 ➔ v2.4.2</span>
            </div>
            <div className="p-4 font-mono text-xs overflow-y-auto space-y-1">
              <div className="text-gray-500">...</div>
              <div className="text-gray-300">You must formulate hypotheses based strictly on the EDA profile.</div>
              <div className="text-gray-300">Do not invent column names.</div>
              <div className="bg-red-500/10 text-red-400 px-2 py-1 rounded-sm border-l-2 border-red-500 my-1 line-through">
                - You may interpret correlations as potential causal links.
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-sm border-l-2 border-emerald-500 my-1">
                + UNDER NO CIRCUMSTANCES should you imply causation from observational data.
              </div>
              <div className="bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded-sm border-l-2 border-emerald-500 my-1">
                + If the data is not from a Randomized Controlled Trial, state 'associational' only.
              </div>
              <div className="text-gray-500">...</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
