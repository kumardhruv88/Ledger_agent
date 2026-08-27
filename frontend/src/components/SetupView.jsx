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
    <div className="flex flex-col items-center justify-start w-full min-h-screen pt-16 pb-32">
      
      {/* Eyebrow Badge */}
      <div className="flex items-center space-x-2 px-3 py-1 mb-6 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
        <div className="w-1.5 h-1.5 rounded-full bg-aivora-accent shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
        <span className="text-[11px] font-medium tracking-[0.2em] text-[#A0A0A0] uppercase">
          Intelligence 2.0 — First Preview
        </span>
      </div>

      {/* Hero Typography */}
      <div className="text-center flex flex-col items-center z-10">
        <h1 className="text-[64px] md:text-[88px] leading-[1] font-semibold tracking-[-0.03em] text-center max-w-[1000px]">
          <span className="text-gradient">Intelligent Agents.</span><br />
          <span className="text-[#f5f5f5]">Real Results.</span>
        </h1>
        
        <p className="mt-6 text-[17px] md:text-[18px] leading-relaxed text-[#7a7a7a] max-w-[600px] text-center font-normal">
          Deploy intelligent agents that reason over your data, execute statistical workflows, 
          and turn complex information into actionable, validated results.
        </p>

        <button className="mt-8 btn-primary px-8 py-3.5 text-[15px]">
          Deploy Your Agent
        </button>
      </div>

      {/* Agent Flow Visual Network (Compressed Spacing) */}
      <div className="relative mt-8 w-full max-w-[1000px] h-[500px] flex items-center justify-center">
        
        {/* Connection Lines (SVG) - Branched cleanly like Aivora */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <defs>
            <filter id="glow-green" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-cyan" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" fill="none">
            {/* Left Branch (Central to Upload & RAG) */}
            <path d="M 500 250 L 350 250" />
            {/* Up to RAG */}
            <path d="M 350 250 C 350 250, 300 250, 300 150 L 250 150" />
            <circle cx="260" cy="150" r="4" fill="#0ea5e9" filter="url(#glow-cyan)" stroke="none" />
            
            {/* Down to CSV Upload */}
            <path d="M 350 250 C 350 250, 300 250, 300 350 L 250 350" />
            <circle cx="260" cy="350" r="4" fill="#10b981" filter="url(#glow-green)" stroke="none" />


            {/* Right Branch (Central to Sheets & Plotly) */}
            <path d="M 500 250 L 650 250" />
            {/* Up to Plotly */}
            <path d="M 650 250 C 650 250, 700 250, 700 150 L 750 150" />
            <circle cx="740" cy="150" r="4" fill="#f97316" filter="url(#glow-orange)" stroke="none" />
            
            {/* Down to Sheets */}
            <path d="M 650 250 C 650 250, 700 250, 700 350 L 750 350" />
            <circle cx="740" cy="350" r="4" fill="#10b981" filter="url(#glow-green)" stroke="none" />
          </g>
        </svg>

        {/* Central Agent Node */}
        <div className="absolute z-10 aivora-card p-1.5 flex items-center justify-center w-[240px] h-[76px] bg-[#0A0A0A]">
          {/* Inner border wrapper */}
          <div className="w-full h-full border border-white/5 rounded-[8px] flex items-center px-4 space-x-4 bg-gradient-to-br from-white/[0.03] to-transparent">
            {/* Glowing Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-aivora-accent/20 blur-md rounded-full"></div>
              <Cpu className="w-6 h-6 text-white relative z-10" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-[17px] font-semibold text-white tracking-tight leading-tight">AI Agent</span>
              <span className="text-[13px] text-[#7a7a7a] font-medium">Statistical Engine</span>
            </div>
          </div>
        </div>

        {/* Outer Node: RAG Context (Top Left) */}
        <div className="absolute top-[100px] left-[150px] z-10 flex flex-col items-center">
          <div className="aivora-card p-1.5 w-[90px] h-[90px] bg-[#0A0A0A] flex items-center justify-center">
            <div className="w-full h-full border border-white/5 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-[#0ea5e9]/10 to-transparent">
              <FileText className="w-8 h-8 text-[#0ea5e9]" strokeWidth={1.5} />
            </div>
          </div>
          <span className="mt-4 text-[13px] font-medium text-[#d4d4d4]">RAG Dictionary</span>
          <span className="text-[11px] text-[#666]">Domain Context</span>
        </div>

        {/* Outer Node: Plotly Visuals (Top Right) */}
        <div className="absolute top-[100px] right-[150px] z-10 flex flex-col items-center">
          <div className="aivora-card p-1.5 w-[90px] h-[90px] bg-[#0A0A0A] flex items-center justify-center">
            <div className="w-full h-full border border-white/5 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-[#f97316]/10 to-transparent">
              <Activity className="w-8 h-8 text-[#f97316]" strokeWidth={1.5} />
            </div>
          </div>
          <span className="mt-4 text-[13px] font-medium text-[#d4d4d4]">Plotly Charts</span>
          <span className="text-[11px] text-[#666]">Visualization</span>
        </div>

        {/* Outer Node: CSV Upload (Bottom Left) */}
        <div className="absolute bottom-[50px] left-[150px] z-20 flex flex-col items-center group">
          <label className="cursor-pointer flex flex-col items-center">
            <div className="aivora-card p-1.5 w-[90px] h-[90px] bg-[#0A0A0A] flex items-center justify-center transition-all duration-300 group-hover:border-[#10b981]/50">
              <div className="w-full h-full border border-white/5 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-[#10b981]/10 to-transparent">
                <Upload className="w-8 h-8 text-[#10b981]" strokeWidth={1.5} />
              </div>
            </div>
            <span className="mt-4 text-[13px] font-medium text-[#d4d4d4]">Upload Dataset</span>
            <span className="text-[11px] text-[#666]">CSV / XLSX</span>
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
        <div className="absolute bottom-[50px] right-[150px] z-20 flex flex-col items-center">
          <div className="aivora-card p-1.5 w-[90px] h-[90px] bg-[#0A0A0A] flex items-center justify-center">
            <div className="w-full h-full border border-white/5 rounded-[8px] flex items-center justify-center bg-gradient-to-br from-[#10b981]/10 to-transparent">
              <Database className="w-8 h-8 text-[#10b981]" strokeWidth={1.5} />
            </div>
          </div>
          <span className="mt-4 text-[13px] font-medium text-[#d4d4d4]">Google Sheets</span>
          
          {/* Subtle Input embedded below text */}
          <div className="mt-2 flex w-[140px] space-x-1 border border-white/10 rounded overflow-hidden focus-within:border-white/30 transition-colors bg-[#080808]">
            <input 
              type="text" 
              placeholder="Paste URL..." 
              className="flex-grow bg-transparent px-2 py-1 text-[11px] text-white placeholder-[#555] focus:outline-none"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              disabled={isUploading}
            />
            <button 
              onClick={handleSheetConnect}
              disabled={!sheetUrl || isUploading}
              className="px-2 text-[#10b981] hover:bg-[#10b981]/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed border-l border-white/10"
            >
              <LinkIcon className="w-3 h-3" />
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
