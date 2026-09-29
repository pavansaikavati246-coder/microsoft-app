import React from 'react';
import { 
  LayoutDashboard, 
  BrainCircuit, 
  SplitSquareVertical, 
  GitBranch, 
  Network, 
  History, 
  ShieldAlert,
  Cpu
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeIncidentsCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  activeIncidentsCount
}) => {
  const navItems = [
    { id: 'overview', label: 'Command Center', icon: LayoutDashboard },
    { id: 'investigation', label: 'AI Investigation', icon: BrainCircuit, badge: activeIncidentsCount > 0 ? activeIncidentsCount : undefined, badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
    { id: 'before-after', label: 'Before / After Proof', icon: SplitSquareVertical, highlight: true },
    { id: 'patterns', label: 'Incident Patterns', icon: GitBranch },
    { id: 'graph', label: 'Memory Graph', icon: Network },
    { id: 'history', label: 'Incident History', icon: History },
    { id: 'architecture', label: 'System Blueprint', icon: Cpu }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6">
        {/* Navigation Section */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
            Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-slate-800/90 text-cyan-400 border border-slate-700/80 shadow-sm'
                      : item.highlight
                      ? 'text-purple-300 hover:bg-purple-950/30 hover:text-purple-200'
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : item.highlight ? 'text-purple-400' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Hindsight Status Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Hindsight Engine Active</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Persistent incident vector index is online. Every resolved incident automatically trains future investigations.
          </p>
          <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500 font-mono border-t border-slate-800/60">
            <span>Memory Mode</span>
            <span className="text-emerald-400 font-bold">Vector-Linked</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-900 text-[11px] text-slate-500 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
          <span>IncidentIQ v2.4</span>
        </div>
        <span className="font-mono text-[10px] text-slate-600">SRE AI-Agent</span>
      </div>
    </aside>
  );
};
