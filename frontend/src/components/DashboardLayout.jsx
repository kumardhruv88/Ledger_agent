import React, { useState } from 'react';
import { Network, Terminal, LayoutDashboard, Target, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import LivePipelineView from './LivePipelineView';
import DashboardView from './DashboardView';
import TelemetryView from './TelemetryView';
import AdversaryView from './AdversaryView';

export default function DashboardLayout({ sessionId, onExit }) {
  const [activeTab, setActiveTab] = useState('pipeline');

  const navItems = [
    { id: 'pipeline', label: 'Live Pipeline', icon: Network },
    { id: 'telemetry', label: 'LangSmith Telemetry', icon: Terminal },
    { id: 'results', label: 'Frozen Ledger', icon: LayoutDashboard },
    { id: 'adversary', label: 'Adversary (Self-Improve)', icon: Target },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'pipeline':
        return <LivePipelineView sessionId={sessionId} onComplete={() => setActiveTab('results')} />;
      case 'telemetry':
        return <TelemetryView sessionId={sessionId} />;
      case 'results':
        return <DashboardView sessionId={sessionId} />;
      case 'adversary':
        return <AdversaryView sessionId={sessionId} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-aivora-bg overflow-hidden text-white font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-[280px] h-full border-r border-white/5 bg-[#050505]/80 backdrop-blur-xl flex flex-col pt-8 pb-6 px-4 z-20">
        <div className="flex items-center space-x-3 px-4 mb-12">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-white/20 to-white/5 border border-white/10 flex items-center justify-center">
            <span className="font-bold text-white text-sm">L</span>
          </div>
          <span className="font-semibold tracking-tight text-[18px]">Ledger Agent</span>
        </div>

        <div className="flex flex-col space-y-2 flex-grow">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.05)] border border-white/10" 
                    : "text-[#7a7a7a] hover:bg-white/5 hover:text-gray-200 border border-transparent"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-white" : "text-[#555]")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button 
            onClick={onExit}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-[#7a7a7a] hover:text-red-400 hover:bg-red-400/10 transition-all duration-300"
          >
            <LogOut className="w-5 h-5" />
            <span>Exit Session</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-full relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A0A0A] via-aivora-bg to-aivora-bg">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-transparent opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_10%,transparent_100%)] pointer-events-none"></div>

        <div className="relative z-10 w-full h-full overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-[1400px] mx-auto w-full h-full">
            {renderContent()}
          </div>
        </div>
      </div>
      
    </div>
  );
}
