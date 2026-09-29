import React, { useState } from 'react';
import { GitBranch, ShieldCheck, Database, Key, Server, ChevronRight } from 'lucide-react';
import type { IncidentPattern, Incident } from '../types/incident';

interface PatternsViewProps {
  patterns: IncidentPattern[];
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
}

export const PatternsView: React.FC<PatternsViewProps> = ({
  patterns,
  incidents,
  onSelectIncident
}) => {
  const [selectedPatternId, setSelectedPatternId] = useState<string>(patterns[0]?.id || '');

  const selectedPattern = patterns.find(p => p.id === selectedPatternId) || patterns[0];

  const getCategoryIcon = (cat: string) => {
    if (cat.toLowerCase().includes('database')) return Database;
    if (cat.toLowerCase().includes('auth')) return Key;
    return Server;
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <GitBranch className="w-4 h-4" />
          <span>Organizational Failure Taxonomy</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1 tracking-tight">
          Recurring Incident Patterns
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Hindsight memory clusters recurring incidents into structural failure patterns to accelerate triage.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Pattern Cards */}
        <div className="space-y-4">
          {patterns.map((pat) => {
            const Icon = getCategoryIcon(pat.category);
            const isSelected = pat.id === selectedPatternId;
            return (
              <div
                key={pat.id}
                onClick={() => setSelectedPatternId(pat.id)}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-950/30'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSelected ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {pat.category}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 rounded-full font-mono">
                    {pat.incidentCount} Incidents
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mt-3">{pat.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{pat.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Linked to Releases: <strong className="text-white">{pat.deploymentLinkedCount}</strong></span>
                  <span>Avg MTTR: <strong className="text-emerald-400">{pat.avgMTTR}</strong></span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Pattern Detail & Supporting Incidents */}
        {selectedPattern && (
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div>
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  <span>Category: {selectedPattern.category}</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">
                  {selectedPattern.title}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed mt-2">
                  {selectedPattern.description}
                </p>
              </div>

              {/* Verified Common Resolution */}
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Learned Common Resolution Strategy</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">
                  "{selectedPattern.commonResolution}"
                </p>
              </div>

              {/* Supporting Incidents */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                  Supporting Historical Incidents ({selectedPattern.supportingIncidentIds.length})
                </h3>

                <div className="space-y-3">
                  {selectedPattern.supportingIncidentIds.map((incId) => {
                    const inc = incidents.find(i => i.id === incId);
                    if (!inc) return null;
                    return (
                      <div
                        key={inc.id}
                        onClick={() => onSelectIncident(inc.id)}
                        className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 cursor-pointer group flex items-center justify-between transition-all"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-mono text-xs font-bold text-cyan-400">{inc.id}</span>
                            <span className="text-xs font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">{inc.title}</span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            Service: {inc.service} • Root Cause: {inc.hypotheses?.[0]?.title || 'Identified'}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-all" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
