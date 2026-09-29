import type { Incident, AgentStep, HindsightMatch, RootCauseHypothesis, RecommendedAction, RemediationResult } from '../types/incident';
import { hindsightEngine } from './hindsightEngine';

export class AgentOrchestrator {

  /**
   * Runs an autonomous investigation step-by-step
   */
  public static async runInvestigation(
    incident: Incident,
    onStepUpdate: (steps: AgentStep[], currentIncident: Incident) => void,
    hasMemory: boolean = true
  ): Promise<Incident> {
    const steps: AgentStep[] = [];
    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const addStep = (toolName: string, description: string, status: AgentStep['status'] = 'running', output?: any) => {
      const step: AgentStep = {
        id: `step-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        timestamp: now(),
        toolName,
        description,
        status,
        output
      };
      steps.push(step);
      onStepUpdate([...steps], { ...updatedIncident });
      return step;
    };

    const updateLastStep = (status: AgentStep['status'], output?: any) => {
      if (steps.length > 0) {
        steps[steps.length - 1].status = status;
        if (output) steps[steps.length - 1].output = output;
      }
      onStepUpdate([...steps], { ...updatedIncident });
    };

    let updatedIncident: Incident = { ...incident, status: 'investigating' };

    // STEP 1: Context Extraction
    addStep('extract_incident_context', `Analyzing ${incident.service} (${incident.severity.toUpperCase()}) payload parameters...`);
    await new Promise(r => setTimeout(r, 400));
    updateLastStep('completed', { service: incident.service, deployment: incident.recentDeployment || 'v2.8.4', env: incident.environment });

    // STEP 2: Error Log & Stacktrace Analysis
    addStep('analyze_error_logs', `Scanning stack traces and exception signatures...`);
    await new Promise(r => setTimeout(r, 500));
    const logAnalysis = {
      primaryError: incident.errorPattern,
      stackPattern: incident.logs[0] || 'HTTP 503 Service Unavailable',
      contentionDetected: true
    };
    updateLastStep('completed', logAnalysis);

    // STEP 3: Hindsight Memory Retrieval (The core differentiator!)
    let matches: HindsightMatch[] = [];
    addStep('search_historical_incidents', hasMemory ? 'Searching Hindsight memory for similar historical incidents...' : 'Searching historical incident log database (No memory index)...');
    await new Promise(r => setTimeout(r, 600));

    if (hasMemory) {
      matches = hindsightEngine.searchMemory({
        service: incident.service,
        errorPattern: incident.errorPattern,
        logs: incident.logs,
        recentDeployment: incident.recentDeployment,
        excludeId: incident.id
      });
      updatedIncident.hindsightMatches = matches;
      updateLastStep('completed', { matchesFound: matches.length, topMatch: matches[0]?.incidentId || 'None' });
    } else {
      // WITHOUT MEMORY MODE
      updatedIncident.hindsightMatches = [];
      updateLastStep('completed', { matchesFound: 0, note: 'No persistent hindsight memory indexed for this cluster.' });
    }

    // STEP 4: Deployment & Config History Lookup
    addStep('get_recent_deployments', `Inspecting CI/CD git commits and deployment audit logs...`);
    await new Promise(r => setTimeout(r, 450));
    const deploymentInfo = {
      recentVersion: incident.recentDeployment || 'v2.8.4',
      deployedAt: '12 minutes ago',
      configModified: true
    };
    updateLastStep('completed', deploymentInfo);

    // STEP 5: Root Cause Formulation
    addStep('formulate_root_cause_hypotheses', `Synthesizing evidence and generating confidence hypotheses...`);
    await new Promise(r => setTimeout(r, 650));

    let hypotheses: RootCauseHypothesis[] = [];
    let recommendation: RecommendedAction;

    if (hasMemory && matches.length > 0) {
      const topMatch = matches[0];
      hypotheses = [
        {
          id: 'hyp-1',
          title: `Database Connection Pool Exhaustion (Matches ${topMatch.incidentId})`,
          description: `The recent deployment ${incident.recentDeployment || 'v2.8.4'} modified connection-pool limits, causing thread starvation identical to ${topMatch.incidentId}.`,
          confidence: Math.min(96, topMatch.similarity + 2),
          evidenceLevel: 'strong',
          evidenceList: [
            `Current symptoms match ${topMatch.incidentId} (${topMatch.similarity}% similarity)`,
            `Deployment ${incident.recentDeployment || 'v2.8.4'} occurred 12m before error spike`,
            `Previous resolution via deployment rollback recovered service in ${topMatch.leadTimeMinutes} minutes`
          ],
          relatedIncidentIds: matches.map(m => m.incidentId)
        },
        {
          id: 'hyp-2',
          title: 'Unbound Outbound HTTP Socket Contention',
          description: 'High traffic volume causing HTTP client thread exhaustion.',
          confidence: 42,
          evidenceLevel: 'moderate',
          evidenceList: ['Worker thread pool queue elevated'],
          relatedIncidentIds: []
        },
        {
          id: 'hyp-3',
          title: 'Upstream Network Proxy Failure',
          description: 'Network partition between API Gateway and upstream services.',
          confidence: 18,
          evidenceLevel: 'weak',
          evidenceList: ['General network latency'],
          relatedIncidentIds: []
        }
      ];

      recommendation = {
        id: 'rec-1',
        actionType: 'rollback',
        targetService: incident.service,
        targetVersion: 'v2.8.3',
        title: `Rollback ${incident.service} Deployment ${incident.recentDeployment || 'v2.8.4'}`,
        summary: `Execute rollback to v2.8.3 and restore connection pool limits.`,
        rationaleBullets: [
          `Current symptoms match ${topMatch.incidentId} (${topMatch.similarity}% contextual similarity)`,
          `Deployment ${incident.recentDeployment || 'v2.8.4'} altered connection-pool parameters`,
          `Previous incidents (${matches.slice(0, 2).map(m => m.incidentId).join(', ')}) recovered in ~${topMatch.leadTimeMinutes} minutes following config rollback`,
          `No stronger historical alternative was identified`
        ],
        riskLevel: 'low'
      };
    } else {
      // Generic hypothesis without memory
      hypotheses = [
        {
          id: 'hyp-no-mem-1',
          title: 'Generic Database Connectivity or Network Issue',
          description: 'The 503 error may be caused by database connectivity, configuration, or network issues.',
          confidence: 45,
          evidenceLevel: 'moderate',
          evidenceList: ['HTTP 503 error status code received'],
          relatedIncidentIds: []
        },
        {
          id: 'hyp-no-mem-2',
          title: 'Unspecified Memory Leak or Load Spike',
          description: 'Application memory saturation requiring generic restart.',
          confidence: 35,
          evidenceLevel: 'weak',
          evidenceList: ['High latency reported'],
          relatedIncidentIds: []
        }
      ];

      recommendation = {
        id: 'rec-no-mem',
        actionType: 'restart',
        targetService: incident.service,
        title: `Restart ${incident.service} Container Instances`,
        summary: 'Perform generic service restart. (No historical context available)',
        rationaleBullets: [
          'No historical memory match found for this error signature',
          'Generic restart recommended to temporarily clear potential socket locks',
          'Root cause confidence is low due to missing institutional context'
        ],
        riskLevel: 'medium'
      };
    }

    updatedIncident.hypotheses = hypotheses;
    updatedIncident.recommendation = recommendation;
    updatedIncident.status = 'awaiting_approval';

    updateLastStep('completed', {
      hypothesesGenerated: hypotheses.length,
      recommendedAction: recommendation.title,
      awaitingApproval: true
    });

    return updatedIncident;
  }

  /**
   * Executes remediation action after Human Approval
   */
  public static async executeRemediation(
    incident: Incident,
    onStepUpdate: (steps: AgentStep[], currentIncident: Incident) => void
  ): Promise<Incident> {
    const steps: AgentStep[] = [];
    const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const addStep = (toolName: string, description: string, status: AgentStep['status'] = 'running', output?: any) => {
      const step: AgentStep = {
        id: `step-${Date.now()}`,
        timestamp: now(),
        toolName,
        description,
        status,
        output
      };
      steps.push(step);
      onStepUpdate([...steps], { ...updatedIncident });
      return step;
    };

    let updatedIncident: Incident = { ...incident, status: 'remediating' };

    // STEP 1: Execute Action
    addStep('execute_remediation', `Executing approved action: ${incident.recommendation?.title}...`);
    await new Promise(r => setTimeout(r, 800));

    const remediationResult: RemediationResult = {
      executedAt: new Date().toISOString(),
      actionExecuted: incident.recommendation?.title || 'Rollback v2.8.4',
      status: 'SUCCESS',
      metricsBefore: {
        errorRate: '38.4%',
        http503Count: '124/min',
        p99Latency: '3800ms'
      },
      metricsAfter: {
        errorRate: '0.1%',
        http503Count: '0/min',
        p99Latency: '82ms'
      },
      recoveryStatus: 'RECOVERED'
    };

    updatedIncident.remediationResult = remediationResult;
    updatedIncident.status = 'verifying';

    // STEP 2: Verification
    addStep('verify_incident_status', 'Verifying post-remediation system health, error rates, and HTTP counters...');
    await new Promise(r => setTimeout(r, 700));
    steps[steps.length - 1].status = 'completed';
    steps[steps.length - 1].output = { errorRateDrop: '38.4% -> 0.1%', status: 'RECOVERED' };

    // STEP 3: Post-Incident Learning & Memory Update
    addStep('record_incident_outcome', 'Persisting incident postmortem record into Hindsight Memory store...');
    await new Promise(r => setTimeout(r, 600));

    const lessonsLearned = [
      `Rollback of ${incident.recentDeployment || 'v2.8.4'} successfully eliminated 503 errors within 45 seconds.`,
      `Database connection pool configurations must be capped with automated safety overrides in CI.`,
      `Hindsight memory updated: 4 out of 5 connection-pool incidents resolved via config rollback.`
    ];

    updatedIncident.lessonsLearned = lessonsLearned;
    updatedIncident.status = 'resolved';
    updatedIncident.resolvedAt = new Date().toISOString();
    updatedIncident.durationMinutes = 9;

    // Save into Hindsight Engine!
    hindsightEngine.recordIncidentOutcome(updatedIncident);

    steps[steps.length - 1].status = 'completed';
    steps[steps.length - 1].output = { hindsightUpdated: true, lessonsCount: lessonsLearned.length };

    onStepUpdate([...steps], { ...updatedIncident });
    return updatedIncident;
  }
}
