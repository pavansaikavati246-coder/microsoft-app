import React, { useState } from 'react';
import { X, AlertTriangle, Plus } from 'lucide-react';
import type { Incident, IncidentSeverity } from '../types/incident';

interface CreateIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateIncident: (incident: Incident) => void;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  isOpen,
  onClose,
  onCreateIncident
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState<string>('API Gateway 503 Service Unavailable');
  const [service, setService] = useState<string>('API Gateway');
  const [environment, setEnvironment] = useState<string>('Production');
  const [severity, setSeverity] = useState<IncidentSeverity>('critical');
  const [errorPattern, setErrorPattern] = useState<string>('HTTP 503 Service Unavailable - upstream connection pool exhausted');
  const [recentDeployment, setRecentDeployment] = useState<string>('v2.8.4');
  const [logs, setLogs] = useState<string>(
    '2026-09-29T06:50:01Z [ERROR] API Gateway socket pool size zero.\n2026-09-29T06:50:12Z [FATAL] HTTP 503 returned to 1,840 clients.\n2026-09-29T06:50:20Z [WARN] Thread lock contention on worker event loop.'
  );

  const handlePresetSelect = (presetNum: number) => {
    if (presetNum === 1) {
      setTitle('API Gateway 503 Service Unavailable');
      setService('API Gateway');
      setEnvironment('Production');
      setSeverity('critical');
      setErrorPattern('HTTP 503 Service Unavailable - upstream connection pool exhausted');
      setRecentDeployment('v2.8.4');
      setLogs('2026-09-29T06:50:01Z [ERROR] Upstream socket pool exhausted.\n2026-09-29T06:50:15Z [FATAL] 503 Service Unavailable cascade downstream.');
    } else if (presetNum === 2) {
      setTitle('Database Connection Pool Saturation');
      setService('Database Service');
      setEnvironment('Production');
      setSeverity('critical');
      setErrorPattern('FATAL: remaining connection slots are reserved for non-replication superuser connections');
      setRecentDeployment('v2.8.2');
      setLogs('2026-09-29T06:52:10Z [ERROR] DB max connections 100/100 reached.\n2026-09-29T06:52:25Z [WARN] Query queue timeout.');
    } else {
      setTitle('Auth Token Signature Verification Failure');
      setService('Auth Service');
      setEnvironment('Production');
      setSeverity('high');
      setErrorPattern('JWTSignaturePublicKeyNotFoundException: RSA Key ID auth-2026-key-02 undefined');
      setRecentDeployment('v1.14.0');
      setLogs('2026-09-29T06:55:00Z [ERROR] JWKS key invalidation timeout.\n2026-09-29T06:55:10Z [WARN] 99% auth rejection rate.');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInc: Incident = {
      id: `INC-${Math.floor(100 + Math.random() * 900)}`,
      title,
      service,
      environment,
      severity,
      status: 'active',
      errorPattern,
      recentDeployment,
      logs: logs.split('\n').filter(l => l.trim().length > 0),
      createdAt: new Date().toISOString()
    };

    onCreateIncident(newInc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden space-y-6">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Report Production Incident</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          
          {/* Quick Scenario Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
              Quick Load Demo Scenario Presets:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect(1)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left space-y-0.5 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400">1. API Gateway 503</div>
                <div className="text-[10px] text-slate-500 font-mono">v2.8.4 Deploy</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect(2)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left space-y-0.5 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400">2. DB Pool Exhaustion</div>
                <div className="text-[10px] text-slate-500 font-mono">Connection saturation</div>
              </button>

              <button
                type="button"
                onClick={() => handlePresetSelect(3)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-left space-y-0.5 group"
              >
                <div className="font-bold text-slate-200 group-hover:text-cyan-400">3. Auth Key Mismatch</div>
                <div className="text-[10px] text-slate-500 font-mono">JWKS Cache TTL</div>
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Incident Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="API Gateway">API Gateway</option>
                <option value="Database Service">Database Service</option>
                <option value="Auth Service">Auth Service</option>
                <option value="Payment Service">Payment Service</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Severity</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as IncidentSeverity)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-medium">Recent Deployment</label>
              <input
                type="text"
                value={recentDeployment}
                onChange={(e) => setRecentDeployment(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Primary Error Signature</label>
            <input
              type="text"
              value={errorPattern}
              onChange={(e) => setErrorPattern(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-rose-400 font-mono focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-slate-400 font-medium">Error Logs Excerpt</label>
            <textarea
              rows={3}
              value={logs}
              onChange={(e) => setLogs(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-300 font-mono text-[11px] focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center space-x-2 shadow-md shadow-cyan-600/30"
            >
              <Plus className="w-4 h-4" />
              <span>Create & Investigate</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
