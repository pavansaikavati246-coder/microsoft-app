import React, { useState } from 'react';
import { 
  BrainCircuit, 
  CheckCircle2, 
  RotateCcw, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  FileText, 
  Terminal, 
  ArrowRight,
  ThumbsDown,
  RefreshCw,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Incident, AgentStep } from '../types/incident';
import { AgentOrchestrator } from '../services/agentOrchestrator';

interface InvestigationWorkspaceProps {
  incident: Incident;
  onUpdateIncident: (updated: Incident) => void;
  onSelectIncident: (id: string) => void;
}

export const InvestigationWorkspace: React.FC<InvestigationWorkspaceProps> = ({
  incident,
  onUpdateIncident,
  onSelectIncident
}) => {
  const [steps, setSteps] = useState<AgentStep[]>([]);
  const [isInvestigating, setIsInvestigating] = useState<boolean>(false);
  const [isRemediating, setIsRemediating] = useState<boolean>(false);
  const [rejectionNote, setRejectionNote] = useState<string | null>(null);

  // Trigger autonomous agent investigation
  const startAgentInvestigation = async (hasMemory: boolean = true) => {
    setIsInvestigating(true);
    setRejectionNote(null);

    await AgentOrchestrator.runInvestigation(
      incident,
      (newSteps, currentIncident) => {
        setSteps(newSteps);
        onUpdateIncident(currentIncident);
      },
      hasMemory
    );

    setIsInvestigating(false);
  };

  // Trigger Human Approved Remediation Action
  const handleApproveAction = async () => {
    setIsRemediating(true);

    await AgentOrchestrator.executeRemediation(
      incident,
      (newSteps, currentIncident) => {
        setSteps(prev => [...prev, ...newSteps]);
        onUpdateIncident(currentIncident);
      }
    );

    setIsRemediating(false);

    // Trigger celebratory confetti on recovery verification!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10B981', '#06B6D4', '#8B5CF6']
    });
  };

  const handleRejectAction = () => {
    setRejectionNote('Action rejected by SRE. Requesting alternate hypothesis...');
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center space-x-3">
            <span className="font-mono text-sm font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded border border-cyan-500/20">
              {incident.id}
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-bold uppercase rounded border ${
              incident.severity === 'critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' :
              incident.severity === 'high' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
            }`}>
              {incident.severity}
            </span>
            <span className={`px-2.5 py-0.5 text-xs font-semibold rounded border ${
              incident.status === 'resolved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              incident.status === 'awaiting_approval' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 animate-pulse'
            }`}>
              STATUS: {incident.status.toUpperCase().replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-2 tracking-tight">
            {incident.title}
          </h1>
        </div>

        {/* Action button if investigation hasn't started */}
        {(!incident.hypotheses || incident.hypotheses.length === 0) && (
          <div className="flex items-center space-x-3">
            <button
              onClick={() => startAgentInvestigation(true)}
              disabled={isInvestigating}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-50"
            >
              <BrainCircuit className="w-4 h-4" />
              <span>{isInvestigating ? 'Investigating Memory...' : 'Start Agent Investigation'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Grid: Context & Live Tool Execution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Incident Context Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <span>Incident Context</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Target Service</span>
                <span className="font-semibold text-slate-200">{incident.service}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Environment</span>
                <span className="font-semibold text-slate-200">{incident.environment}</span>
              </div>
              {incident.recentDeployment && (
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Recent Deployment</span>
                  <span className="font-mono text-cyan-400 font-bold">{incident.recentDeployment}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Detected At</span>
                <span className="text-slate-300 font-mono">{incident.createdAt.replace('T', ' ').slice(0, 19)}</span>
              </div>
            </div>

            {/* Error Log Snippet */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                Primary Error Signature:
              </span>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-rose-400 font-mono text-[11px] leading-relaxed break-all">
                {incident.errorPattern}
              </div>
            </div>

            {/* Sample Logs */}
            {incident.logs && incident.logs.length > 0 && (
              <div className="pt-2">
                <span className="text-[11px] font-semibold text-slate-400 mb-1.5 block">
                  Log Stream Excerpt:
                </span>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 text-slate-300 font-mono text-[10px] space-y-1 overflow-x-auto">
                  {incident.logs.map((log, i) => (
                    <div key={i} className="whitespace-pre-wrap">{log}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Hindsight Memory Matches Sidebar Box */}
          {incident.hindsightMatches && incident.hindsightMatches.length > 0 && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/30 shadow-lg shadow-emerald-950/20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BrainCircuit className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Historical Memory</h3>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">
                  {incident.hindsightMatches.length} Matches
                </span>
              </div>

              <div className="space-y-3">
                {incident.hindsightMatches.map((match) => (
                  <div
                    key={match.incidentId}
                    onClick={() => onSelectIncident(match.incidentId)}
                    className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer group transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-400 group-hover:underline">
                        {match.incidentId}
                      </span>
                      <span className="px-2 py-0.5 text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 rounded-full font-mono">
                        {match.similarity}% match
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-slate-200 mt-1 line-clamp-1">
                      {match.title}
                    </h4>

                    <div className="mt-2 text-[11px] text-slate-400 space-y-1">
                      <div><strong className="text-slate-300">Root Cause:</strong> {match.rootCause}</div>
                      <div><strong className="text-slate-300">Resolution:</strong> {match.resolution}</div>
                      <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-500">
                        <span>Lead Time: {match.leadTimeMinutes}m</span>
                        <span className="text-emerald-400 font-bold">{match.outcome}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Agent Activity & Hypothesis / Recommendation Workspace */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Agent Activity Trace */}
          {steps.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span>Agent Tool Activity Trace</span>
              </h3>

              <div className="space-y-2 font-mono text-xs">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="flex items-start space-x-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
                  >
                    <div className="pt-0.5">
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : step.status === 'running' ? (
                        <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                      ) : (
                        <Clock className="w-4 h-4 text-slate-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-cyan-400 font-bold">{step.toolName}()</span>
                        <span className="text-slate-500">{step.timestamp}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] font-sans">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Root Cause Hypotheses */}
          {incident.hypotheses && incident.hypotheses.length > 0 && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Evidence-Backed Root Cause Hypotheses</span>
                </h2>
              </div>

              <div className="space-y-4">
                {incident.hypotheses.map((hyp) => (
                  <div
                    key={hyp.id}
                    className={`p-4 rounded-xl border transition-all ${
                      hyp.confidence > 70
                        ? 'bg-slate-950 border-cyan-500/40 shadow-sm shadow-cyan-900/20'
                        : 'bg-slate-950/50 border-slate-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">{hyp.title}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">{hyp.description}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-extrabold text-cyan-400 font-mono">
                          {hyp.confidence}%
                        </span>
                        <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                          Confidence
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                        style={{ width: `${hyp.confidence}%` }}
                      />
                    </div>

                    {/* Evidence List */}
                    {hyp.evidenceList && hyp.evidenceList.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Supporting Evidence & Memory References:
                        </span>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {hyp.evidenceList.map((ev, i) => (
                            <li key={i} className="flex items-center space-x-2">
                              <span className="text-cyan-400">•</span>
                              <span>{ev}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 13 & 14 Prompt Requirement: Structured Recommendation & Human-in-the-Loop */}
          {incident.recommendation && incident.status !== 'resolved' && (
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-cyan-500/30 shadow-xl shadow-cyan-950/30 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white tracking-tight">
                      RECOMMENDED ACTION
                    </h2>
                    <p className="text-xs text-slate-400">
                      Human approval required prior to production execution.
                    </p>
                  </div>
                </div>
                <span className="px-2.5 py-1 text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md">
                  Risk Level: {incident.recommendation.riskLevel.toUpperCase()}
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white">
                  {incident.recommendation.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {incident.recommendation.summary}
                </p>

                {/* Rationale Bullets */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono">
                    WHY THIS ACTION?
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {incident.recommendation.rationaleBullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-cyan-400 font-bold">•</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Human-in-the-loop Approval Controls */}
              {rejectionNote ? (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center justify-between">
                  <span>{rejectionNote}</span>
                  <button
                    onClick={() => setRejectionNote(null)}
                    className="text-xs underline hover:text-white"
                  >
                    Clear
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={handleApproveAction}
                    disabled={isRemediating}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 cursor-pointer disabled:opacity-50 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 fill-slate-950" />
                    <span>{isRemediating ? 'Executing Action...' : 'Approve Action'}</span>
                  </button>

                  <button
                    onClick={handleRejectAction}
                    className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs flex items-center space-x-1.5 border border-slate-700 transition-all cursor-pointer"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => startAgentInvestigation(true)}
                    className="px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 font-medium text-xs flex items-center space-x-1.5 border border-slate-800 transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Investigate Further</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Section 16 & 17 Prompt Requirement: Remediation Verification & Post-Incident Learning */}
          {incident.status === 'resolved' && incident.remediationResult && (
            <div className="space-y-6">
              
              {/* Verification Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-emerald-500/40 shadow-xl shadow-emerald-950/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">
                        VERIFICATION & RECOVERY
                      </h2>
                      <p className="text-xs text-slate-400">
                        Action Executed: {incident.remediationResult.actionExecuted}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full">
                    STATUS: {incident.remediationResult.recoveryStatus}
                  </span>
                </div>

                {/* Metrics Comparison Grid */}
                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      Error Rate
                    </span>
                    <div className="mt-1 flex items-center justify-center space-x-2">
                      <span className="text-sm line-through text-rose-400 font-mono">
                        {incident.remediationResult.metricsBefore.errorRate}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">
                        {incident.remediationResult.metricsAfter.errorRate}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      HTTP 503 Count
                    </span>
                    <div className="mt-1 flex items-center justify-center space-x-2">
                      <span className="text-sm line-through text-rose-400 font-mono">
                        {incident.remediationResult.metricsBefore.http503Count}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">
                        {incident.remediationResult.metricsAfter.http503Count}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                      P99 Latency
                    </span>
                    <div className="mt-1 flex items-center justify-center space-x-2">
                      <span className="text-sm line-through text-rose-400 font-mono">
                        {incident.remediationResult.metricsBefore.p99Latency}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500" />
                      <span className="text-lg font-extrabold text-emerald-400 font-mono">
                        {incident.remediationResult.metricsAfter.p99Latency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Post-Incident Learning Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-500/30 space-y-4">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">
                    POST-INCIDENT LEARNING
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Root Cause Confirmed</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Resolution Recorded</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Hindsight Memory Updated</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-300">Future Detection Improved</span>
                  </div>
                </div>

                {incident.lessonsLearned && incident.lessonsLearned.length > 0 && (
                  <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-1.5">
                    <span className="font-bold text-purple-300 uppercase tracking-wider font-mono">
                      Lessons Saved to Persistent Intelligence:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {incident.lessonsLearned.map((lesson, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <span className="text-purple-400 font-bold">•</span>
                          <span>{lesson}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
