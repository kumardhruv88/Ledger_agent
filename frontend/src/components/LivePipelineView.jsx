import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, { Background, Controls, applyNodeChanges, applyEdgeChanges, MarkerType } from 'reactflow';
import 'reactflow/dist/style.css';
import AgentNode from './AgentNode';

const nodeTypes = {
  agent: AgentNode,
};

const initialNodes = [
  { id: 'upload', type: 'agent', position: { x: 50, y: 150 }, data: { label: 'Upload', status: 'idle', details: '' } },
  { id: 'A0', type: 'agent', position: { x: 350, y: 150 }, data: { label: 'A0 Janitor', status: 'idle', details: '' } },
  { id: 'A1', type: 'agent', position: { x: 650, y: 150 }, data: { label: 'A1 Profiler', status: 'idle', details: '' } },
  { id: 'A2', type: 'agent', position: { x: 950, y: 150 }, data: { label: 'A2 Proposer', status: 'idle', details: '' } },
  
  { id: 'A4', type: 'agent', position: { x: 350, y: 350 }, data: { label: 'A4 Executor', status: 'idle', details: '' } },
  { id: 'A5', type: 'agent', position: { x: 650, y: 350 }, data: { label: 'A5 Statistician', status: 'idle', details: '' } },
  { id: 'A6', type: 'agent', position: { x: 950, y: 350 }, data: { label: 'A6 Reporter', status: 'idle', details: '' } },
  { id: 'A7', type: 'agent', position: { x: 1250, y: 350 }, data: { label: 'A7 Adversary', status: 'idle', details: '' } },
];

const initialEdges = [
  { id: 'e-up-0', source: 'upload', target: 'A0', type: 'smoothstep', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'e-0-1', source: 'A0', target: 'A1', type: 'smoothstep', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'e-1-2', source: 'A1', target: 'A2', type: 'smoothstep', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  
  // Freeze gap
  { id: 'e-2-4', source: 'A2', target: 'A4', type: 'smoothstep', animated: false, style: { stroke: 'rgba(255,255,255,0.2)', strokeDasharray: '5,5' }, label: 'Freeze', labelBgStyle: { fill: 'transparent' }, labelStyle: { fill: '#6b7280' } },
  
  { id: 'e-4-5', source: 'A4', target: 'A5', type: 'smoothstep', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'e-5-6', source: 'A5', target: 'A6', type: 'smoothstep', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  { id: 'e-6-7', source: 'A6', target: 'A7', type: 'smoothstep', animated: false, style: { stroke: 'rgba(255,255,255,0.2)' } },
  // Feedback loop
  { id: 'e-7-4', source: 'A7', target: 'A4', type: 'smoothstep', animated: false, sourceHandle: 'bottom', targetHandle: 'bottom', style: { stroke: 'rgba(239,68,68,0.5)', strokeDasharray: '5,5' } },
];

export default function LivePipelineView({ sessionId, method, payload, onComplete }) {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [logs, setLogs] = useState([]);
  const hasStarted = useRef(false);

  const updateNodeState = (nodeId, status, details = '') => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id === nodeId) {
          return { ...n, data: { ...n.data, status, details } };
        }
        return n;
      })
    );
  };

  const animateEdge = (sourceId, targetId, active) => {
    setEdges((eds) => 
      eds.map((e) => {
        if (e.source === sourceId && e.target === targetId) {
          return {
            ...e,
            animated: active,
            style: { 
              ...e.style, 
              stroke: active ? '#3b82f6' : 'rgba(255,255,255,0.2)' 
            }
          };
        }
        return e;
      })
    );
  };

  useEffect(() => {
    if (!sessionId || hasStarted.current) return;
    hasStarted.current = true;

    const startPipeline = async () => {
      try {
        let response;
        if (method === 'upload') {
          updateNodeState('upload', 'running', 'Uploading...');
          response = await fetch(`http://localhost:8000/api/sessions/${sessionId}/upload`, {
            method: 'POST',
            body: payload,
          });
        } else if (method === 'connect-sheet') {
          updateNodeState('upload', 'running', 'Fetching sheet...');
          response = await fetch(`http://localhost:8000/api/sessions/${sessionId}/connect-sheet`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });
        }

        if (!response.ok) {
          throw new Error('Pipeline request failed');
        }

        updateNodeState('upload', 'success', 'Data loaded');
        animateEdge('upload', 'A0', true);

        // Read SSE Stream
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              const { stage, message } = data;
              
              setLogs(prev => [...prev, `[${stage}] ${message}`]);

              // Update nodes based on stage mapping
              const stageMap = {
                'UPLOAD': 'upload',
                'JANITOR': 'A0',
                'PROFILER': 'A1',
                'PROPOSER': 'A2',
                'EXECUTOR': 'A4',
                'STATISTICIAN': 'A5',
                'REPORTER': 'A6',
                'ADVERSARY': 'A7'
              };

              const nodeId = stageMap[stage];
              if (nodeId) {
                // Set all previous to success, current to running
                setNodes(nds => nds.map(n => {
                  if (n.id === nodeId) return { ...n, data: { ...n.data, status: 'running', details: message } };
                  // Very simplified completion logic for visual flair
                  return n;
                }));
              }

              if (stage === 'COMPLETE') {
                updateNodeState('A7', 'success', 'Validation passed');
                setTimeout(() => onComplete(), 2000);
              }
            }
          }
        }
      } catch (err) {
        console.error(err);
        setLogs(prev => [...prev, `[ERROR] ${err.message}`]);
      }
    };

    startPipeline();
  }, [sessionId, method, payload, onComplete]);

  return (
    <div className="w-full h-[70vh] glass-panel flex flex-col relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full p-4 bg-black/40 border-b border-white/10 z-10 flex justify-between items-center backdrop-blur-md">
        <h3 className="font-semibold text-lg text-white">Agentic Pipeline Execution</h3>
        <div className="flex space-x-2 items-center text-sm text-gray-400">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Live Execution</span>
        </div>
      </div>
      
      <div className="flex-grow w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          className="bg-transparent"
        >
          <Background color="rgba(255,255,255,0.05)" gap={20} size={1} />
        </ReactFlow>
      </div>

      <div className="absolute bottom-4 left-4 right-4 h-32 glass-panel p-4 overflow-y-auto text-xs font-mono text-gray-400 shadow-2xl">
        {logs.map((log, i) => (
          <div key={i} className="mb-1">{log}</div>
        ))}
        {logs.length === 0 && <div>Waiting for stream...</div>}
      </div>
    </div>
  );
}
