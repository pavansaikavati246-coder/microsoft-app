export type IncidentSeverity = 'critical' | 'high' | 'medium' | 'low';

export type IncidentStatus = 
  | 'active' 
  | 'investigating' 
  | 'awaiting_approval' 
  | 'remediating' 
  | 'verifying' 
  | 'resolved';

export interface HindsightMatch {
  incidentId: string;
  title: string;
  service: string;
  similarity: number; // 0 - 100
  matchedDimensions: string[];
  rootCause: string;
  resolution: string;
  outcome: string;
  leadTimeMinutes: number;
  date: string;
}

export interface RootCauseHypothesis {
  id: string;
  title: string;
  description: string;
  confidence: number; // 0 - 100
  evidenceLevel: 'strong' | 'moderate' | 'weak';
  evidenceList: string[];
  relatedIncidentIds: string[];
}

export interface RecommendedAction {
  id: string;
  actionType: 'rollback' | 'restart' | 'config_restore' | 'scale_out' | 'cache_clear';
  targetService: string;
  targetVersion?: string;
  title: string;
  summary: string;
  rationaleBullets: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RemediationResult {
  executedAt: string;
  actionExecuted: string;
  status: 'SUCCESS' | 'FAILED';
  metricsBefore: {
    errorRate: string;
    http503Count: string;
    p99Latency: string;
  };
  metricsAfter: {
    errorRate: string;
    http503Count: string;
    p99Latency: string;
  };
  recoveryStatus: 'RECOVERED' | 'DEGRADED' | 'UNRESOLVED';
}

export interface Incident {
  id: string;
  title: string;
  service: string;
  environment: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  errorPattern: string;
  logs: string[];
  recentDeployment?: string;
  createdAt: string;
  resolvedAt?: string;
  durationMinutes?: number;
  hypotheses?: RootCauseHypothesis[];
  recommendation?: RecommendedAction;
  remediationResult?: RemediationResult;
  hindsightMatches?: HindsightMatch[];
  lessonsLearned?: string[];
  isDemoTarget?: boolean;
}

export interface AgentStep {
  id: string;
  timestamp: string;
  toolName: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  output?: any;
}

export interface IncidentPattern {
  id: string;
  category: string;
  title: string;
  description: string;
  incidentCount: number;
  deploymentLinkedCount: number;
  avgMTTR: string;
  commonResolution: string;
  supportingIncidentIds: string[];
}

export interface LearnedInsight {
  id: string;
  bullet: string;
  category: 'database' | 'deployment' | 'auth' | 'gateway' | 'general';
  confidenceScore: number;
  supportingIncidentsCount: number;
  createdAt: string;
}
