import React, { useState } from 'react';
import { History, Search, ChevronRight } from 'lucide-react';
import type { Incident } from '../types/incident';

interface IncidentHistoryProps {
  incidents: Incident[];
  onSelectIncident: (id: string) => void;
  searchQuery: string;
}

export const IncidentHistory: React.FC<IncidentHistoryProps> = ({
  incidents,
  onSelectIncident,
  searchQuery
}) => {
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [localSearch, setLocalSearch] = useState<string>('');

  const activeSearch = searchQuery || localSearch;

  const filteredIncidents = incidents.filter(inc => {
    if (serviceFilter !== 'all' && inc.service !== serviceFilter) return false;
    if (severityFilter !== 'all' && inc.severity !== severityFilter) return false;
    if (activeSearch) {
      const q = activeSearch.toLowerCase();
      const matchText = (inc.id + ' ' + inc.title + ' ' + inc.service + ' ' + inc.errorPattern).toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const services = Array.from(new Set(incidents.map(i => i.service)));

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
          <History className="w-4 h-4" />
          <span>Institutional Knowledge Base</span>
        </div>
        <h1 className="text-2xl font-bold text-white mt-1 tracking-tight">
          Incident History & Postmortems
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Complete searchable directory of past production incidents, root cause analyses, and verified resolutions.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3 flex-1 min-w-[240px]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="Search history by keyword..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Service Filter */}
          <select
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 font-mono"
          >
            <option value="all">All Services</option>
            {services.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-cyan-500/50 font-mono"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono bg-slate-950/60">
              <th className="py-3.5 px-6">ID</th>
              <th className="py-3.5 px-6">Title & Service</th>
              <th className="py-3.5 px-6">Severity</th>
              <th className="py-3.5 px-6">Root Cause</th>
              <th className="py-3.5 px-6">Resolution</th>
              <th className="py-3.5 px-6">Duration</th>
              <th className="py-3.5 px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredIncidents.map((incident) => (
              <tr
                key={incident.id}
                onClick={() => onSelectIncident(incident.id)}
                className="hover:bg-slate-800/40 cursor-pointer group transition-colors"
              >
                <td className="py-4 px-6 font-mono font-bold text-cyan-400">
                  {incident.id}
                </td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                    {incident.title}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {incident.service} • {incident.environment}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded border ${
                    incident.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
                    incident.severity === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                    'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                  }`}>
                    {incident.severity}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-300 max-w-xs truncate">
                  {incident.hypotheses?.[0]?.title || 'Database Pool Exhaustion'}
                </td>
                <td className="py-4 px-6 text-slate-300 max-w-xs truncate">
                  {incident.recommendation?.title || 'Rollback Configuration'}
                </td>
                <td className="py-4 px-6 font-mono text-emerald-400 font-semibold">
                  {incident.durationMinutes ? `${incident.durationMinutes}m` : '12m'}
                </td>
                <td className="py-4 px-6 text-right">
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 inline-block transition-transform group-hover:translate-x-0.5" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
