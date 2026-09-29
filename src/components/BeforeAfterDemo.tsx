import React, { useState } from 'react';
import { 
  SplitSquareVertical, 
  BrainCircuit, 
  AlertCircle, 
  CheckCircle2
} from 'lucide-react';

export const BeforeAfterDemo: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'side-by-side' | 'without' | 'with'>('side-by-side');

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold uppercase tracking-wider">
            <SplitSquareVertical className="w-4 h-4" />
            <span>Hackathon Proof of Value</span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1 tracking-tight">
            Before vs After Hindsight Memory
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Demonstrating how persistent incident memory transforms generic LLM guessing into instant context-aware investigation.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setActiveTab('side-by-side')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'side-by-side' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Side-by-Side Comparison
          </button>
          <button
            onClick={() => setActiveTab('without')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'without' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            1. Without Memory
          </button>
          <button
            onClick={() => setActiveTab('with')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'with' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            2. With Hindsight
          </button>
        </div>
      </div>

      {/* Target Incident Scenario */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded">
            INC-032 (Test Case)
          </span>
          <div>
            <h3 className="text-sm font-bold text-white">API Gateway 503 Spike Post Deployment v2.8.4</h3>
            <p className="text-xs text-slate-400">Error: 503 Service Unavailable • Connection pool exhausted • Production</p>
          </div>
        </div>
        <span className="px-2.5 py-0.5 text-xs font-mono font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded">
          CRITICAL
        </span>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CARD 1: WITHOUT MEMORY */}
        {(activeTab === 'side-by-side' || activeTab === 'without') && (
          <div className="p-6 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-3 py-1 bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold uppercase rounded-bl-xl border-l border-b border-rose-500/30">
              Without Hindsight Memory
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Generic AI Assistant</h2>
                <p className="text-xs text-slate-400">Standard stateless LLM reasoning</p>
              </div>
            </div>

            {/* Response Box */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-slate-400">Agent Output:</span>
                <span className="text-rose-400 font-bold font-mono">Confidence: 45% (Low)</span>
              </div>
              <p className="text-xs text-slate-300 italic leading-relaxed">
                "The 503 Service Unavailable error may be caused by generic database connectivity, network partitioning, missing configuration, or general server load overload."
              </p>
            </div>

            {/* Reasoning & Recommendation */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Proposed Recommendation:
              </span>
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-2">
                <span className="font-bold text-white">Generic Container Restart</span>
                <p className="text-slate-400">
                  Restart all container instances across cluster to flush temporary memory.
                </p>
                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-rose-400 flex items-center space-x-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>High risk of repeating downtime. Root cause remains unknown.</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Investigation Time</span>
                <span className="text-rose-400 font-bold text-base">35-45 minutes</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                <span className="text-slate-500 text-[10px] block">Institutional Memory</span>
                <span className="text-rose-400 font-bold text-base">None (0 matches)</span>
              </div>
            </div>
          </div>
        )}

        {/* CARD 2: WITH HINDSIGHT MEMORY */}
        {(activeTab === 'side-by-side' || activeTab === 'with') && (
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 space-y-6 relative overflow-hidden shadow-xl shadow-emerald-950/20">
            <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase rounded-bl-xl border-l border-b border-emerald-500/40">
              With Hindsight Core
            </div>

            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <BrainCircuit className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">IncidentIQ Hindsight Agent</h2>
                <p className="text-xs text-slate-400">Context-linked persistent vector memory</p>
              </div>
            </div>

            {/* Response Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-bold">Hindsight Matched: INC-027 (92%) & INC-014 (87%)</span>
                <span className="text-emerald-400 font-bold font-mono">Confidence: 96% (High)</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                "This incident closely matches INC-014 and INC-027. Both occurred shortly after deployment v2.8.x and involved database connection-pool exhaustion. INC-027 was resolved in 11m by rolling back connection parameters."
              </p>
            </div>

            {/* Reasoning & Recommendation */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">
                Evidence-Backed Recommendation:
              </span>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-xs space-y-2">
                <span className="font-bold text-white">Rollback API Gateway Deployment v2.8.4</span>
                <p className="text-slate-300">
                  Restore connection pool parameters (max_connections=250) verified in INC-027.
                </p>
                <div className="pt-2 border-t border-slate-800 text-[11px] text-emerald-400 flex items-center space-x-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>High confidence fix. 4/5 similar historical incidents recovered via rollback.</span>
                </div>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-center">
                <span className="text-slate-500 text-[10px] block">Investigation Time</span>
                <span className="text-emerald-400 font-bold text-base">2 minutes (-90%)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/30 text-center">
                <span className="text-slate-500 text-[10px] block">Institutional Memory</span>
                <span className="text-emerald-400 font-bold text-base">3 Matches Linked</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
