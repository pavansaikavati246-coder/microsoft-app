import React, { useState } from 'react';
import { Play, ArrowRight, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Incident } from '../types/incident';
import { AgentOrchestrator } from '../services/agentOrchestrator';

interface HeroDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectIncident: (id: string) => void;
  onUpdateIncident: (inc: Incident) => void;
}

export const HeroDemoModal: React.FC<HeroDemoModalProps> = ({
  isOpen,
  onClose,
  onSelectIncident,
  onUpdateIncident
}) => {
  if (!isOpen) return null;

  const [currentScene, setCurrentScene] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [heroIncident, setHeroIncident] = useState<Incident | null>(null);

  const scenes = [
    { num: 1, title: 'Scene 1 — Incident Intake', desc: 'API Gateway returns HTTP 503 errors post-deployment v2.8.4.' },
    { num: 2, title: 'Scene 2 — Agent Tool Calling', desc: 'Agent actively scans error patterns, logs, and git commits.' },
    { num: 3, title: 'Scene 3 — Hindsight Retrieval', desc: 'Hindsight finds 92% match with INC-027 and 87% with INC-014.' },
    { num: 4, title: 'Scene 4 — Pattern Identification', desc: 'Agent identifies structural connection-pool config failure.' },
    { num: 5, title: 'Scene 5 — Structured Recommendation', desc: 'Agent recommends rolling back v2.8.4 configuration.' },
    { num: 6, title: 'Scene 6 — Human Approval Gate', desc: 'SRE engineer reviews rationale and approves action.' },
    { num: 7, title: 'Scene 7 — Automated Remediation', desc: 'Simulated Kubernetes config rollback executes cleanly.' },
    { num: 8, title: 'Scene 8 — Post-Action Verification', desc: 'Metrics verify 503 errors drop from 124/min to 0/min.' },
    { num: 9, title: 'Scene 9 — Persistent Memory Update', desc: 'Incident postmortem recorded into organizational memory.' },
    { num: 10, title: 'Scene 10 — Second Incident Test', desc: 'Second similar incident triggers zero-delay 98% memory fix!' }
  ];

  const runScene = async (sceneNum: number) => {
    setCurrentScene(sceneNum);
    setIsRunning(true);

    if (sceneNum === 1) {
      const inc: Incident = {
        id: 'INC-032',
        title: 'API Gateway 503 Spike Post Deployment v2.8.4',
        service: 'API Gateway',
        environment: 'Production',
        severity: 'critical',
        status: 'active',
        errorPattern: 'HTTP 503 Service Unavailable - upstream connection pool exhausted',
        recentDeployment: 'v2.8.4',
        logs: [
          '2026-09-29T06:50:01Z [ERROR] API Gateway socket pool size zero.',
          '2026-09-29T06:50:15Z [FATAL] 503 Service Unavailable downstream cascade.'
        ],
        createdAt: new Date().toISOString()
      };
      setHeroIncident(inc);
      onUpdateIncident(inc);
      onSelectIncident('INC-032');
    } else if (sceneNum === 2 || sceneNum === 3 || sceneNum === 4 || sceneNum === 5) {
      if (heroIncident) {
        const investigated = await AgentOrchestrator.runInvestigation(heroIncident, (_, cur) => {
          onUpdateIncident(cur);
        }, true);
        setHeroIncident(investigated);
      }
    } else if (sceneNum === 6 || sceneNum === 7 || sceneNum === 8 || sceneNum === 9) {
      if (heroIncident) {
        const resolved = await AgentOrchestrator.executeRemediation(heroIncident, (_, cur) => {
          onUpdateIncident(cur);
        });
        setHeroIncident(resolved);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } else if (sceneNum === 10) {
      // Scene 10: Second incident INC-038 instantly resolves via memory
      const inc38: Incident = {
        id: 'INC-038',
        title: 'API Gateway Connection Pool Saturation',
        service: 'API Gateway',
        environment: 'Production',
        severity: 'critical',
        status: 'active',
        errorPattern: 'HTTP 503 Service Unavailable - upstream connection pool exhausted',
        recentDeployment: 'v2.8.5',
        logs: ['2026-09-29T07:10:00Z [ERROR] Socket pool size zero.'],
        createdAt: new Date().toISOString()
      };
      onUpdateIncident(inc38);
      onSelectIncident('INC-038');

      await AgentOrchestrator.runInvestigation(inc38, (_, cur) => {
        onUpdateIncident(cur);
      }, true);
    }

    setIsRunning(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden space-y-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
              <Play className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                IncidentIQ Hero Demo (60-90s Narrative)
              </h2>
              <p className="text-xs text-slate-400">
                Tagline: <strong className="text-emerald-400">Every Incident Teaches the Agent.</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scene Stepper */}
        <div className="px-6 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Step {currentScene} of 10</span>
            <span className="text-emerald-400 font-bold">{scenes[currentScene - 1].title}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <p className="text-slate-200 font-semibold leading-relaxed">
              {scenes[currentScene - 1].desc}
            </p>
          </div>

          <div className="grid grid-cols-5 gap-1.5 pt-2">
            {scenes.map((sc) => (
              <button
                key={sc.num}
                onClick={() => runScene(sc.num)}
                className={`py-1.5 px-2 rounded text-[10px] font-mono font-bold border transition-all ${
                  currentScene === sc.num
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : sc.num < currentScene
                    ? 'bg-slate-800 text-slate-400 border-slate-700'
                    : 'bg-slate-950 text-slate-600 border-slate-900'
                }`}
              >
                S{sc.num}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => currentScene > 1 && runScene(currentScene - 1)}
            disabled={currentScene === 1 || isRunning}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 disabled:opacity-40"
          >
            Previous Scene
          </button>

          {currentScene < 10 ? (
            <button
              onClick={() => runScene(currentScene + 1)}
              disabled={isRunning}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <span>Advance to Scene {currentScene + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center space-x-2"
            >
              <span>Finish Demo & Explore</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
