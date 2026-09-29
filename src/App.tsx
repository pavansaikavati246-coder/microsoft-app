import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CommandCenter } from './components/CommandCenter';
import { InvestigationWorkspace } from './components/InvestigationWorkspace';
import { BeforeAfterDemo } from './components/BeforeAfterDemo';
import { PatternsView } from './components/PatternsView';
import { MemoryGraph } from './components/MemoryGraph';
import { IncidentHistory } from './components/IncidentHistory';
import { ArchitectureView } from './components/ArchitectureView';
import { CreateIncidentModal } from './components/CreateIncidentModal';
import { HeroDemoModal } from './components/HeroDemoModal';
import { hindsightEngine } from './services/hindsightEngine';
import type { Incident } from './types/incident';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [patterns, setPatterns] = useState(hindsightEngine.getPatterns());
  const [insights, setInsights] = useState(hindsightEngine.getLearnedInsights());
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>('INC-027');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isHeroDemoOpen, setIsHeroDemoOpen] = useState<boolean>(false);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setIncidents([...hindsightEngine.getIncidents()]);
    setPatterns([...hindsightEngine.getPatterns()]);
    setInsights([...hindsightEngine.getLearnedInsights()]);
  };

  const handleSelectIncident = (id: string) => {
    setSelectedIncidentId(id);
    setActiveTab('investigation');
  };

  const handleUpdateIncident = (updated: Incident) => {
    hindsightEngine.recordIncidentOutcome(updated);
    refreshData();
  };

  const handleCreateIncident = (newInc: Incident) => {
    hindsightEngine.recordIncidentOutcome(newInc);
    refreshData();
    setSelectedIncidentId(newInc.id);
    setActiveTab('investigation');
  };

  const handleResetDemo = () => {
    hindsightEngine.resetToDemoDefaults();
    refreshData();
    setSelectedIncidentId('INC-027');
    setActiveTab('overview');
  };

  const currentIncident = incidents.find(i => i.id === selectedIncidentId) || incidents[0];
  const activeIncidentsCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        onStartHeroDemo={() => setIsHeroDemoOpen(true)}
        onResetDemo={handleResetDemo}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* App Body Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeIncidentsCount={activeIncidentsCount}
        />

        {/* Main Content Workspace */}
        <main className="flex-1 overflow-y-auto bg-slate-950/60 pb-16">
          {activeTab === 'overview' && (
            <CommandCenter
              incidents={incidents}
              insights={insights}
              onSelectIncident={handleSelectIncident}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
              onStartHeroDemo={() => setIsHeroDemoOpen(true)}
            />
          )}

          {activeTab === 'investigation' && currentIncident && (
            <InvestigationWorkspace
              incident={currentIncident}
              onUpdateIncident={handleUpdateIncident}
              onSelectIncident={handleSelectIncident}
            />
          )}

          {activeTab === 'before-after' && (
            <BeforeAfterDemo />
          )}

          {activeTab === 'patterns' && (
            <PatternsView
              patterns={patterns}
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
            />
          )}

          {activeTab === 'graph' && (
            <MemoryGraph
              onSelectIncident={handleSelectIncident}
            />
          )}

          {activeTab === 'history' && (
            <IncidentHistory
              incidents={incidents}
              onSelectIncident={handleSelectIncident}
              searchQuery={searchQuery}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureView />
          )}
        </main>
      </div>

      {/* Create Incident Modal */}
      <CreateIncidentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateIncident={handleCreateIncident}
      />

      {/* Hero Demo Guided Controller Modal */}
      <HeroDemoModal
        isOpen={isHeroDemoOpen}
        onClose={() => setIsHeroDemoOpen(false)}
        onSelectIncident={handleSelectIncident}
        onUpdateIncident={handleUpdateIncident}
      />
    </div>
  );
};

export default App;
