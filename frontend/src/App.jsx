import React, { useState } from 'react';
import SetupView from './components/SetupView';
import LivePipelineView from './components/LivePipelineView';
import DashboardView from './components/DashboardView';
import LandingContent from './components/LandingContent';

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
      {/* Minimal Navigation */}
      <nav className="w-full relative z-50">
        <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between border-b border-white/[0.04]">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="font-semibold tracking-tight text-[17px] text-white">Ledger</span>
          </div>
          
          {/* Center Links */}
          <div className="hidden md:flex items-center space-x-10 text-[14px] font-medium text-[#A0A0A0]">
            <button className="text-white transition-colors cursor-default">Home</button>
            <button className="hover:text-white transition-colors">AI Agents</button>
            <button className="hover:text-white transition-colors">About</button>
            <button className="hover:text-white transition-colors">Blog</button>
            <button className="hover:text-white transition-colors">Pricing</button>
          </div>
          
          {/* CTA */}
          <div className="flex items-center">
            <button className="px-5 py-2.5 bg-transparent border border-white/10 hover:border-white/30 rounded-md text-[14px] font-medium text-white transition-all duration-300">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <main className="w-full flex flex-col items-center justify-start pb-20">
        {currentView === 'setup' && (
          <>
            <SetupView onSessionStart={handleSessionStart} />
            <LandingContent />
          </>
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
