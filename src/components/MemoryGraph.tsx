import React, { useState } from 'react';
import { Network, BrainCircuit, ChevronRight } from 'lucide-react';

interface MemoryGraphProps {
  onSelectIncident: (id: string) => void;
}

export const MemoryGraph: React.FC<MemoryGraphProps> = ({
  onSelectIncident
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('INC-027');

  const nodes = [
    { id: 'INC-014', label: 'INC-014', type: 'incident', service: 'API Gateway', title: 'Gateway Connection Timeout', x: 150, y: 120, color: '#06B6D4' },
    { id: 'INC-027', label: 'INC-027', type: 'incident', service: 'Database Service', title: 'DB Pool Exhaustion', x: 400, y: 120, color: '#10B981' },
    { id: 'INC-031', label: 'INC-031', type: 'incident', service: 'Auth Service', title: 'Auth Token Key Mismatch', x: 650, y: 120, color: '#8B5CF6' },
    { id: 'PAT-001', label: 'Pattern: Connection Pool Limits', type: 'pattern', service: 'Infrastructure', title: 'Post-Deployment Pool Contention', x: 275, y: 280, color: '#F59E0B' },
    { id: 'RES-001', label: 'Config Rollback Strategy', type: 'resolution', service: 'Remediation', title: 'Restore Prior Pool Parameters', x: 400, y: 400, color: '#10B981' },
    { id: 'RES-002', label: 'Cache Flush Strategy', type: 'resolution', service: 'Remediation', title: 'Invalidate JWKS Key Cache', x: 650, y: 320, color: '#8B5CF6' }
  ];

  const edges = [
    { from: 'INC-014', to: 'INC-027', label: 'Same Root Cause (Pool Limits)' },
    { from: 'INC-031', to: 'INC-027', label: 'Deployment Timing Correlation' },
    { from: 'INC-014', to: 'PAT-001', label: 'Clustered' },
    { from: 'INC-027', to: 'PAT-001', label: 'Clustered' },
    { from: 'PAT-001', to: 'RES-001', label: 'Verified Fix' },
    { from: 'INC-031', to: 'RES-002', label: 'Verified Fix' }
  ];

  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[1];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Network className="w-4 h-4" />
          <span>Persistent Hindsight Topology</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1 tracking-tight">
          Incident Memory Network Graph
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Visualizing memory links between incidents, root causes, failure patterns, and verified resolutions.
        </p>
      </div>

      {/* SVG Canvas & Inspection Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2/3 SVG Canvas */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-slate-950 border border-slate-800 relative min-h-[500px] flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-3">
            <span>Vector Network Topology</span>
            <span className="text-emerald-400">● Interactive Node Map</span>
          </div>

          <svg className="w-full h-[420px] my-auto">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="22" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569" />
              </marker>
            </defs>

            {/* Edges */}
            {edges.map((edge, i) => {
              const source = nodes.find(n => n.id === edge.from);
              const target = nodes.find(n => n.id === edge.to);
              if (!source || !target) return null;
              return (
                <g key={i}>
                  <line
                    x1={source.x}
                    y1={source.y}
                    x2={target.x}
                    y2={target.y}
                    stroke="#334155"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    markerEnd="url(#arrow)"
                  />
                  <text
                    x={(source.x + target.x) / 2}
                    y={(source.y + target.y) / 2 - 8}
                    fill="#64748B"
                    fontSize="10"
                    fontFamily="monospace"
                    textAnchor="middle"
                  >
                    {edge.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    r={isSelected ? "28" : "24"}
                    fill="#0F172A"
                    stroke={node.color}
                    strokeWidth={isSelected ? "3" : "2"}
                    className="transition-all hover:scale-110"
                  />
                  <text
                    textAnchor="middle"
                    dy="4"
                    fill="#F8FAFC"
                    fontSize="11"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.id}
                  </text>
                  <text
                    textAnchor="middle"
                    dy="42"
                    fill="#94A3B8"
                    fontSize="10"
                    fontWeight="500"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Right 1/3 Node Inspector */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" />
            <span>Memory Inspector</span>
          </div>

          <div>
            <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
              {selectedNode.id}
            </span>
            <h2 className="text-lg font-bold text-white mt-2">
              {selectedNode.title}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Type: {selectedNode.type.toUpperCase()} • Service: {selectedNode.service}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Memory Connections
            </span>
            <ul className="space-y-2 text-xs text-slate-300">
              {edges.filter(e => e.from === selectedNode.id || e.to === selectedNode.id).map((e, idx) => (
                <li key={idx} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800/80">
                  <span className="font-mono text-cyan-400">{e.from === selectedNode.id ? e.to : e.from}</span>
                  <span className="text-[11px] text-slate-400">{e.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {selectedNode.type === 'incident' && (
            <button
              onClick={() => onSelectIncident(selectedNode.id)}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <span>View Incident Timeline</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
