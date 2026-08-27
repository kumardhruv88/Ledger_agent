import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { cn } from '../lib/utils';
import { Loader2, CheckCircle2, AlertCircle, Circle } from 'lucide-react';

const AgentNode = ({ data }) => {
  const { label, status, details } = data; // status: 'idle', 'running', 'success', 'error'

  const statusColors = {
    idle: 'border-white/10 text-gray-500 bg-white/5',
    running: 'border-blue-500/50 text-blue-400 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    success: 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10',
    error: 'border-red-500/50 text-red-400 bg-red-500/10'
  };

  return (
    <div className={cn(
      "px-6 py-4 rounded-xl border flex flex-col min-w-[200px] backdrop-blur-md transition-all duration-500",
      statusColors[status] || statusColors.idle
    )}>
      <Handle type="target" position={Position.Left} className="!w-3 !h-3 !bg-[#0a0a0a] !border-2" />
      
      <div className="flex items-center space-x-3 mb-2">
        {status === 'idle' && <Circle className="w-5 h-5 opacity-50" />}
        {status === 'running' && <Loader2 className="w-5 h-5 animate-spin" />}
        {status === 'success' && <CheckCircle2 className="w-5 h-5" />}
        {status === 'error' && <AlertCircle className="w-5 h-5" />}
        
        <span className="font-bold text-lg tracking-wide">{label}</span>
      </div>
      
      {details && (
        <div className="text-xs mt-2 opacity-80 break-words line-clamp-2 max-w-[180px]">
          {details}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="!w-3 !h-3 !bg-[#0a0a0a] !border-2" />
    </div>
  );
};

export default memo(AgentNode);
