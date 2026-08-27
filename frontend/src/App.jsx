import React, { useState } from 'react';
import SetupView from './components/SetupView';
import LivePipelineView from './components/LivePipelineView';
import DashboardView from './components/DashboardView';

export default function App() {
  const [sessionId, setSessionId] = useState(null);
  const [currentView, setCurrentView] = useState('setup'); // setup, pipeline, dashboard
  const [pipelineMethod, setPipelineMethod] = useState(null);
  const [pipelinePayload, setPipelinePayload] = useState(null);

  const handleSessionStart = (id, method, payload) => {
    setSessionId(id);
    setPipelineMethod(method);
    setPipelinePayload(payload);
    setCurrentView('pipeline');
  };

  const handlePipelineComplete = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-aivora-bg text-white font-sans selection:bg-aivora-accent/30 selection:text-white">
      {/* Top Navbar */}
      <nav className="w-full border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded bg-gradient-to-tr from-blue-600 to-emerald-400 flex items-center justify-center font-bold">
              L
            </div>
            <span className="font-semibold tracking-wide text-lg text-white">Ledger <span className="text-gray-500 font-normal">v2</span></span>
          </div>
          <div className="flex space-x-6 text-sm font-medium text-gray-400">
            <button className="hover:text-white transition-colors">Home</button>
            <button className="hover:text-white transition-colors">Agents</button>
            <button className="hover:text-white transition-colors">Observability</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'setup' && (
          <SetupView onSessionStart={handleSessionStart} />
        )}
        
        {currentView === 'pipeline' && (
          <div className="text-center py-10 w-full h-full">
            <h2 className="text-2xl font-bold mb-6">Pipeline Initializing...</h2>
            <LivePipelineView 
              sessionId={sessionId} 
              method={pipelineMethod} 
              payload={pipelinePayload} 
              onComplete={handlePipelineComplete} 
            />
          </div>
        )}
        
        {currentView === 'dashboard' && (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold mb-8">Results Dashboard</h2>
            <DashboardView sessionId={sessionId} />
          </div>
        )}
      </main>
    </div>
  );
}
