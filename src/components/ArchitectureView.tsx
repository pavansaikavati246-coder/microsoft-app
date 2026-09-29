import React from 'react';
import { Cpu, BrainCircuit, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-4 h-4" />
          <span>System Blueprint & Design Specs</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1 tracking-tight">
          IncidentIQ Architecture & Hindsight Core
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Technical design specification for the autonomous incident response agent with persistent vector memory.
        </p>
      </div>

      {/* Architecture Diagram Canvas */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
          End-to-End Execution Pipeline
        </h2>

        {/* Embedded Generated Architecture Diagram */}
        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2 shadow-xl">
          <img
            src="/incidentiq_architecture_diagram_1790645231596.jpg"
            alt="IncidentIQ Architecture Blueprint"
            className="w-full h-auto rounded-lg object-cover"
            onError={(e) => {
              // Fallback SVG representation if direct file link is local
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Core Loop */}
        <div className="p-4 rounded-xl bg-slate-950 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-2 font-mono text-xs text-cyan-400">
          <span>Experience</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>Remember</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>Reason</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>Act</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>Verify</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span>Learn</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="text-emerald-400 font-bold">Improve</span>
        </div>
      </div>

      {/* Architecture Component Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400">
            <BrainCircuit className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Hindsight Vector Memory</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Stores structured incident knowledge (symptoms, logs, deployments, hypotheses, resolutions, lead times, lessons) rather than raw unstructured chat text.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Human-in-the-Loop Gate</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Prevents dangerous autonomous execution. Every remediation requires explicit engineer authorization before execution.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">Post-Incident Verification</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Verifies HTTP 503 drops, error rates, and p99 latency recovery post-remediation before indexing lessons into persistent memory.
          </p>
        </div>
      </div>
    </div>
  );
};
