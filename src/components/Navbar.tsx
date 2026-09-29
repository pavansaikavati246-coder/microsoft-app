import React from 'react';
import { 
  Zap, 
  Play, 
  PlusCircle, 
  Search, 
  SplitSquareVertical, 
  RefreshCw 
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreateModal: () => void;
  onStartHeroDemo: () => void;
  onResetDemo: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreateModal,
  onStartHeroDemo,
  onResetDemo,
  searchQuery,
  setSearchQuery
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Brand & Tagline */}
      <div className="flex items-center space-x-4">
        <div 
          onClick={() => setActiveTab('overview')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
            <div className="w-full h-full bg-slate-950 rounded-[7px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-cyan-400 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-lg tracking-tight text-white font-mono">
                Incident<span className="text-cyan-400">IQ</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded">
                Hindsight Core
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium -mt-0.5">
              Every Incident Teaches the Agent.
            </p>
          </div>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search incidents, error signatures, or memory logs (e.g. 503, connection pool)..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all"
          />
        </div>
      </div>

      {/* Actions & Hero Demo CTA Buttons */}
      <div className="flex items-center space-x-3">
        {/* Before / After Quick Toggle */}
        <button
          onClick={() => setActiveTab('before-after')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2 border transition-all ${
            activeTab === 'before-after'
              ? 'bg-purple-950/40 border-purple-500/50 text-purple-300 shadow-sm shadow-purple-500/20'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
          }`}
          title="Compare Agent Performance Without vs With Hindsight Memory"
        >
          <SplitSquareVertical className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden lg:inline">Memory Proof</span>
        </button>

        {/* Hero Demo Trigger Button */}
        <button
          onClick={onStartHeroDemo}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 flex items-center space-x-2 shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-slate-950" />
          <span>Hero Demo (60s)</span>
        </button>

        {/* Create Incident CTA */}
        <button
          onClick={onOpenCreateModal}
          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-600 hover:bg-cyan-500 text-white flex items-center space-x-1.5 shadow-sm shadow-cyan-600/30 transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>+ Create Incident</span>
        </button>

        {/* Reset Memory state button */}
        <button
          onClick={onResetDemo}
          title="Reset Hindsight Memory Store to Defaults"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
