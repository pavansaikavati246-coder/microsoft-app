import React from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  GitBranch, 
  Brain, 
  Server, 
  Activity, 
  Plus, 
  Zap,
  TrendingDown,
  ChevronRight
} from 'lucide-react';
import type { Incident, LearnedInsight } from '../types/incident';

interface CommandCenterProps {
  incidents: Incident[];
  insights: LearnedInsight[];
  onSelectIncident: (id: string) => void;
  onOpenCreateModal: () => void;
  onStartHeroDemo: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  incidents,
  insights,
  onSelectIncident,
  onOpenCreateModal,
  onStartHeroDemo
}) => {
  const activeIncidents = incidents.filter(i => i.status !== 'resolved');
  const resolvedIncidents = incidents.filter(i => i.status === 'resolved');

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'investigating':
      case 'remediating':
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse';
      case 'awaiting_approval':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center space-x-3">
            <span>Production Command Center</span>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
              Live Real-Time
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Autonomous incident response engine backed by persistent Hindsight memory.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onStartHeroDemo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>Launch Hero Demo</span>
          </button>
          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium flex items-center space-x-2 shadow-md shadow-cyan-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Report Incident</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Incidents</span>
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{activeIncidents.length}</span>
            <span className="text-[11px] font-semibold text-rose-400 flex items-center space-x-1">
              <span>↑ {activeIncidents.length > 0 ? 'Action Required' : 'All Clear'}</span>
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Resolved This Week</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">{resolvedIncidents.length + 23}</span>
            <span className="text-[11px] font-semibold text-emerald-400 flex items-center space-x-0.5">
              <span>↑ 40% faster</span>
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Avg Resolution Time (MTTR)</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <Clock className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">11m</span>
            <span className="text-[11px] font-semibold text-cyan-400 flex items-center space-x-0.5">
              <TrendingDown className="w-3 h-3" />
              <span>32% reduction</span>
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Recurring Patterns</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <GitBranch className="w-4 h-4 text-purple-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white font-mono">03</span>
            <span className="text-[11px] font-semibold text-purple-400">
              Memory indexed
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid: Insights + Active & Recent Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3): Incidents List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
                <span>Recent Production Incidents</span>
                <span className="text-xs font-normal text-slate-400 font-mono">({incidents.length} total)</span>
              </h2>
            </div>

            <div className="divide-y divide-slate-800/60 overflow-hidden">
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  onClick={() => onSelectIncident(incident.id)}
                  className="py-4 flex items-center justify-between group cursor-pointer hover:bg-slate-800/40 -mx-6 px-6 transition-all"
                >
                  <div className="flex items-start space-x-4">
                    <span className="font-mono text-xs font-bold text-cyan-400 pt-0.5">
                      {incident.id}
                    </span>
                    <div>
                      <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                        {incident.title}
                      </h3>
                      <div className="flex items-center space-x-3 mt-1 text-xs text-slate-400">
                        <span>{incident.service}</span>
                        <span>•</span>
                        <span>{incident.environment}</span>
                        {incident.recentDeployment && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-[11px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              {incident.recentDeployment}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 text-[11px] font-bold rounded-md uppercase tracking-wider border ${getSeverityBadge(incident.severity)}`}>
                      {incident.severity}
                    </span>
                    <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${getStatusBadge(incident.status)}`}>
                      {incident.status.replace('_', ' ')}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1/3): WHAT THE AGENT LEARNED & System Health */}
        <div className="space-y-6">
          
          {/* Section 20 Prompt Requirement: WHAT THE AGENT LEARNED */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/20 shadow-lg shadow-purple-900/10 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-400" />
                <h2 className="text-base font-bold text-white tracking-tight">
                  What the Agent Learned
                </h2>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-purple-500/10 text-purple-300 border border-purple-500/30 rounded-full">
                Hindsight Memory
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Accumulated organizational knowledge distilled automatically from past incident resolutions:
            </p>

            <ul className="space-y-3">
              {insights.map((insight) => (
                <li key={insight.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-semibold text-purple-300 uppercase tracking-wider font-mono">
                      ● {insight.category}
                    </span>
                    <span className="text-slate-400 text-[10px] font-mono">
                      {insight.confidenceScore}% confidence
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug font-medium">
                    "{insight.bullet}"
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Health Monitor */}
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>Service Infrastructure</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">4 Active Nodes</span>
            </div>

            <div className="space-y-3">
              {[
                { name: 'API Gateway', status: 'Operational', uptime: '99.98%', color: 'text-emerald-400' },
                { name: 'Auth Service', status: 'Operational', uptime: '99.95%', color: 'text-emerald-400' },
                { name: 'Database Service', status: 'Degraded', uptime: '98.42%', color: 'text-amber-400' },
                { name: 'Payment Service', status: 'Operational', uptime: '99.90%', color: 'text-emerald-400' }
              ].map((srv, idx) => (
                <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/40 border border-slate-800/60 text-xs">
                  <div className="flex items-center space-x-2">
                    <Activity className={`w-3.5 h-3.5 ${srv.color}`} />
                    <span className="font-semibold text-slate-200">{srv.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`font-mono text-[11px] ${srv.color}`}>{srv.status}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{srv.uptime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
