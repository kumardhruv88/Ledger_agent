import React, { useState } from 'react';
import { Upload, Link as LinkIcon, FileText, Bot } from 'lucide-react';
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
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-4xl mx-auto p-6 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          <span className="text-gradient">Intelligent Agents.</span><br />
          <span className="text-white">Real Results.</span>
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
          Deploy AI agents that think, learn, and act on your data. 
          Upload a dataset or connect a Google Sheet to begin the statistical analysis pipeline.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 w-full mt-12">
        {/* Local File Upload */}
        <div className="glass-panel p-8 flex flex-col items-center justify-center space-y-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <Upload className="w-8 h-8 text-blue-400" />
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2 text-white">Upload Dataset</h3>
            <p className="text-sm text-gray-400">CSV or Excel files</p>
          </div>
          <label className="glass-button-primary cursor-pointer w-full text-center py-3 relative z-10">
            {isUploading ? 'Initializing...' : 'Select File'}
            <input 
              type="file" 
              className="hidden" 
              accept=".csv,.xlsx,.xls" 
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>

        {/* Google Sheets Connect */}
        <div className="glass-panel p-8 flex flex-col items-center justify-center space-y-6 relative group overflow-hidden">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
            <LinkIcon className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-center w-full">
            <h3 className="text-xl font-semibold mb-2 text-white">Google Sheets</h3>
            <p className="text-sm text-gray-400">Connect directly via URL</p>
          </div>
          <div className="w-full space-y-3 relative z-10">
            <input 
              type="text" 
              placeholder="https://docs.google.com/spreadsheets/d/..." 
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
              disabled={isUploading}
            />
            <button 
              onClick={handleSheetConnect}
              disabled={!sheetUrl || isUploading}
              className={cn(
                "w-full py-3 rounded-lg font-medium transition-all duration-300 border backdrop-blur-sm",
                sheetUrl 
                  ? "bg-emerald-600/20 hover:bg-emerald-500/30 border-emerald-500/50 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.2)]" 
                  : "bg-white/5 border-white/10 text-gray-500 cursor-not-allowed"
              )}
            >
              Connect Sheet
            </button>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="text-red-400 bg-red-400/10 border border-red-400/20 px-4 py-3 rounded-lg w-full max-w-md text-center text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
