import React, { useState, useRef, useEffect } from 'react';
import { Upload, Link as LinkIcon, FileText, Database, Activity, Cpu } from 'lucide-react';
import { cn } from '../lib/utils';

export default function SetupView({ onSessionStart }) {
  const [sheetUrl, setSheetUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateSession = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/sessions/create', { method: 'POST' });
      const data = await res.json();
      return data.session_id;
    } catch (err) {
      setError('Failed to contact backend. Is it running?');
      throw err;
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    executeUpload(file);
  };

  const executeUpload = async (file) => {
    setIsUploading(true);
    setError(null);
    try {
      const sessionId = await handleCreateSession();
      const formData = new FormData();
      formData.append('file', file);
      onSessionStart(sessionId, 'upload', formData);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSheetConnect = async () => {
    if (!sheetUrl) return;
    setIsUploading(true);
    setError(null);
    try {
      const sessionId = await handleCreateSession();
      onSessionStart(sessionId, 'connect-sheet', { url: sheetUrl });
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen pt-24 pb-32">
      
      {/* Eyebrow Badge */}
      <div className="flex items-center space-x-2 px-3 py-1 mb-8 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-aivora-accent shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
        <span className="text-[11px] font-medium tracking-[0.2em] text-[#A0A0A0] uppercase">
          Intelligence 2.0 — First Preview
        </span>
      </div>

      {/* Hero Typography */}
      <div className="text-center flex flex-col items-center z-10">
        <h1 className="text-[56px] md:text-[84px] leading-[1.05] font-semibold tracking-tight text-center max-w-[1000px]">
          <span className="text-gradient">Intelligent Agents.</span><br />
          <span className="text-[#f5f5f5]">Real Results.</span>
        </h1>
        
        <p className="mt-8 text-[17px] md:text-[19px] leading-relaxed text-[#A0A0A0] max-w-[700px] text-center font-normal">
          Deploy intelligent agents that reason over your data, execute statistical workflows, 
          and turn complex information into actionable, validated results.
        </p>

        <button className="mt-10 btn-primary px-8 py-4 text-[16px]">
          Deploy Your Agent
        </button>
      </div>

      {/* Agent Flow Visual Network */}
      <div className="relative mt-24 w-full max-w-[1000px] h-[600px] flex items-center justify-center">
        
        {/* Connection Lines (SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
              <stop offset="50%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Paths connecting outer nodes to central agent */}
          {/* Top Left (RAG) to Center */}
          <path d="M 250 150 C 400 150, 400 300, 500 300" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />
          <circle cx="250" cy="150" r="3" fill="#10b981" filter="url(#glow)" />
          
          {/* Top Right (Visualization) to Center */}
          <path d="M 750 150 C 600 150, 600 300, 500 300" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />
          <circle cx="750" cy="150" r="3" fill="#0ea5e9" filter="url(#glow)" />
          
          {/* Bottom Left (CSV Upload) to Center */}
          <path d="M 250 450 C 400 450, 400 300, 500 300" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />
          <circle cx="250" cy="450" r="3" fill="#10b981" filter="url(#glow)" />
          
          {/* Bottom Right (Google Sheets) to Center */}
          <path d="M 750 450 C 600 450, 600 300, 500 300" fill="none" stroke="url(#lineGrad)" strokeWidth="1" />
          <circle cx="750" cy="450" r="3" fill="#10b981" filter="url(#glow)" />
        </svg>

        {/* Central Agent Node */}
        <div className="absolute z-10 glass-panel p-6 flex items-center space-x-5 w-[280px] h-[100px] justify-center bg-[#0d0d0e]/80">
          {/* Glow behind center */}
          <div className="absolute inset-0 bg-aivora-accent/5 blur-2xl rounded-full"></div>
          
          <div className="w-12 h-12 rounded-lg bg-black border border-white/10 flex items-center justify-center relative shadow-[inset_0_0_10px_rgba(255,255,255,0.05)]">
            <Cpu className="w-6 h-6 text-[#f5f5f5]" strokeWidth={1.5} />
            <div className="absolute -right-1 -top-1 w-2.5 h-2.5 bg-aivora-accent rounded-full animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.8)]"></div>
          </div>
          <div>
            <h3 className="text-[19px] font-semibold text-white tracking-tight">AI Agent</h3>
            <p className="text-[13px] text-[#888888]">Statistical Engine</p>
          </div>
        </div>

        {/* Outer Node: RAG Context (Top Left) */}
        <div className="absolute top-[100px] left-[50px] z-10 glass-panel p-5 w-[200px] flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-[#111111] border border-white/5 flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-[#888]" strokeWidth={1.5} />
          </div>
          <span className="text-[14px] font-medium text-[#e0e0e0]">RAG Dictionary</span>
          <span className="text-[12px] text-[#666] mt-1">Domain Context</span>
        </div>

        {/* Outer Node: Plotly Visuals (Top Right) */}
        <div className="absolute top-[100px] right-[50px] z-10 glass-panel p-5 w-[200px] flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-[#111111] border border-white/5 flex items-center justify-center mb-3">
            <Activity className="w-5 h-5 text-[#888]" strokeWidth={1.5} />
          </div>
          <span className="text-[14px] font-medium text-[#e0e0e0]">Plotly Charts</span>
          <span className="text-[12px] text-[#666] mt-1">Visualization</span>
        </div>

        {/* Outer Node: CSV Upload (Bottom Left) */}
        <div className="absolute bottom-[100px] left-[50px] z-20 glass-panel p-5 w-[200px] flex flex-col items-center text-center group transition-all duration-300 hover:border-[#10b981]/50 cursor-pointer">
          <label className="cursor-pointer flex flex-col items-center w-full">
            <div className="w-10 h-10 rounded-lg bg-[#111111] border border-white/5 group-hover:border-[#10b981]/30 flex items-center justify-center mb-3 transition-colors">
              <Upload className="w-5 h-5 text-[#10b981]" strokeWidth={1.5} />
            </div>
            <span className="text-[14px] font-medium text-[#e0e0e0]">Upload Dataset</span>
            <span className="text-[12px] text-[#666] mt-1">CSV / XLSX</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Outer Node: Google Sheets (Bottom Right) */}
        <div className="absolute bottom-[100px] right-[50px] z-20 glass-panel p-5 w-[220px] flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-lg bg-[#111111] border border-white/5 flex items-center justify-center mb-3">
            <Database className="w-5 h-5 text-[#10b981]" strokeWidth={1.5} />
          </div>
          <span className="text-[14px] font-medium text-[#e0e0e0] mb-3">Google Sheets</span>
          
          <div className="flex w-full space-x-2">
            <input 
              type="text" 
              placeholder="Paste URL..." 
              className="w-full bg-black/40 border border-white/10 rounded px-2 py-1.5 text-[12px] text-white placeholder-[#666] focus:outline-none focus:border-white/30"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              disabled={isUploading}
            />
            <button 
              onClick={handleSheetConnect}
              disabled={!sheetUrl || isUploading}
              className="bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] rounded px-2 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {error && (
        <div className="mt-8 text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg text-sm max-w-[400px] text-center">
          {error}
        </div>
      )}

    </div>
  );
}
