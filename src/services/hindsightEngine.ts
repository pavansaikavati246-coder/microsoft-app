import type { Incident, HindsightMatch, IncidentPattern, LearnedInsight } from '../types/incident';
import { INITIAL_INCIDENTS, INITIAL_PATTERNS, INITIAL_LEARNED_INSIGHTS } from '../data/mockIncidents';

const INCIDENTS_STORAGE_KEY = 'incidentiq_incidents_v1';
const PATTERNS_STORAGE_KEY = 'incidentiq_patterns_v1';
const INSIGHTS_STORAGE_KEY = 'incidentiq_insights_v1';

class HindsightEngine {
  private incidents: Incident[] = [];
  private patterns: IncidentPattern[] = [];
  private insights: LearnedInsight[] = [];

  constructor() {
    this.loadState();
  }

  private loadState() {
    try {
      const savedIncidents = localStorage.getItem(INCIDENTS_STORAGE_KEY);
      this.incidents = savedIncidents ? JSON.parse(savedIncidents) : [...INITIAL_INCIDENTS];

      const savedPatterns = localStorage.getItem(PATTERNS_STORAGE_KEY);
      this.patterns = savedPatterns ? JSON.parse(savedPatterns) : [...INITIAL_PATTERNS];

      const savedInsights = localStorage.getItem(INSIGHTS_STORAGE_KEY);
      this.insights = savedInsights ? JSON.parse(savedInsights) : [...INITIAL_LEARNED_INSIGHTS];
    } catch (e) {
      console.warn('Failed to parse localStorage Hindsight state, resetting to defaults.', e);
      this.incidents = [...INITIAL_INCIDENTS];
      this.patterns = [...INITIAL_PATTERNS];
      this.insights = [...INITIAL_LEARNED_INSIGHTS];
    }
  }

  private saveState() {
    try {
      localStorage.setItem(INCIDENTS_STORAGE_KEY, JSON.stringify(this.incidents));
      localStorage.setItem(PATTERNS_STORAGE_KEY, JSON.stringify(this.patterns));
      localStorage.setItem(INSIGHTS_STORAGE_KEY, JSON.stringify(this.insights));
    } catch (e) {
      console.error('Failed to persist Hindsight state to localStorage', e);
    }
  }

  public getIncidents(): Incident[] {
    return this.incidents;
  }

  public getIncidentById(id: string): Incident | undefined {
    return this.incidents.find(inc => inc.id === id);
  }

  public getPatterns(): IncidentPattern[] {
    return this.patterns;
  }

  public getLearnedInsights(): LearnedInsight[] {
    return this.insights;
  }

  /**
   * Search Hindsight Memory for contextual similarity
   */
  public searchMemory(query: {
    service: string;
    environment?: string;
    errorPattern: string;
    logs?: string[];
    recentDeployment?: string;
    excludeId?: string;
  }): HindsightMatch[] {
    const matches: HindsightMatch[] = [];

    const queryTokens = (query.errorPattern + ' ' + (query.logs || []).join(' ') + ' ' + (query.recentDeployment || ''))
      .toLowerCase()
      .split(/\W+/)
      .filter(t => t.length > 2);

    for (const inc of this.incidents) {
      if (query.excludeId && inc.id === query.excludeId) continue;
      if (inc.status !== 'resolved') continue;

      let score = 0;
      const matchedDimensions: string[] = [];

      // Dimension 1: Service alignment
      if (inc.service.toLowerCase().includes(query.service.toLowerCase()) || 
          query.service.toLowerCase().includes(inc.service.toLowerCase())) {
        score += 30;
        matchedDimensions.push(`Service match (${inc.service})`);
      }

      // Dimension 2: Deployment context
      if (query.recentDeployment && inc.recentDeployment) {
        score += 25;
        matchedDimensions.push(`Post-deployment timing context (${inc.recentDeployment})`);
      }

      // Dimension 3: Error signature & log token overlap
      const incText = (inc.title + ' ' + inc.errorPattern + ' ' + inc.logs.join(' ') + ' ' + (inc.hypotheses?.[0]?.title || ''))
        .toLowerCase();
      
      let tokenOverlap = 0;
      queryTokens.forEach(token => {
        if (incText.includes(token)) tokenOverlap++;
      });

      const tokenScore = Math.min(35, Math.floor((tokenOverlap / Math.max(1, queryTokens.length)) * 40));
      score += tokenScore;

      if (tokenScore > 10) {
        matchedDimensions.push(`Error signature keyword alignment`);
      }

      // Dimension 4: Root Cause similarity keywords (connection pool, configuration, auth, etc.)
      const isConnectionPool = (query.errorPattern + (query.logs?.join('') || '')).toLowerCase().includes('connection') ||
                              (query.errorPattern + (query.logs?.join('') || '')).toLowerCase().includes('503') ||
                              (query.errorPattern + (query.logs?.join('') || '')).toLowerCase().includes('pool');
      
      if (isConnectionPool && (inc.errorPattern + inc.title).toLowerCase().includes('pool')) {
        score += 15;
        matchedDimensions.push('Connection pool exhaustion pattern');
      }

      const isAuthKey = (query.errorPattern + (query.logs?.join('') || '')).toLowerCase().includes('jwt') ||
                        (query.errorPattern + (query.logs?.join('') || '')).toLowerCase().includes('key') ||
                        (query.errorPattern + (query.logs?.join('') || '')).toLowerCase().includes('auth');
      
      if (isAuthKey && (inc.errorPattern + inc.title).toLowerCase().includes('jwt')) {
        score += 15;
        matchedDimensions.push('Authentication key rotation pattern');
      }

      const finalSimilarity = Math.min(98, Math.max(25, score));

      if (finalSimilarity >= 40) {
        matches.push({
          incidentId: inc.id,
          title: inc.title,
          service: inc.service,
          similarity: finalSimilarity,
          matchedDimensions,
          rootCause: inc.hypotheses?.[0]?.title || 'Root cause identified',
          resolution: inc.recommendation?.title || 'Resolved via configuration rollback',
          outcome: inc.remediationResult?.recoveryStatus === 'RECOVERED' ? 'Successfully Recovered' : 'Resolved',
          leadTimeMinutes: inc.durationMinutes || 12,
          date: inc.createdAt.split('T')[0]
        });
      }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Persist a newly resolved incident into Hindsight Memory & Update Insights
   */
  public recordIncidentOutcome(incident: Incident): void {
    const existingIndex = this.incidents.findIndex(i => i.id === incident.id);
    if (existingIndex >= 0) {
      this.incidents[existingIndex] = incident;
    } else {
      this.incidents.unshift(incident);
    }

    // Dynamic Insight Generation
    if (incident.remediationResult && incident.recommendation) {
      const serviceName = incident.service;
      
      const newInsight: LearnedInsight = {
        id: `ins-${Date.now()}`,
        bullet: `${incident.title} was verified resolved by ${incident.recommendation.title.toLowerCase()} in ${incident.durationMinutes || 8}m.`,
        category: serviceName.toLowerCase().includes('db') ? 'database' : 
                  serviceName.toLowerCase().includes('auth') ? 'auth' : 
                  serviceName.toLowerCase().includes('gateway') ? 'gateway' : 'deployment',
        confidenceScore: 95,
        supportingIncidentsCount: this.incidents.filter(i => i.service === incident.service).length,
        createdAt: new Date().toISOString()
      };

      this.insights.unshift(newInsight);
    }

    this.saveState();
  }

  /**
   * Reset memory store to initial demo state
   */
  public resetToDemoDefaults() {
    this.incidents = [...INITIAL_INCIDENTS];
    this.patterns = [...INITIAL_PATTERNS];
    this.insights = [...INITIAL_LEARNED_INSIGHTS];
    this.saveState();
  }
}

export const hindsightEngine = new HindsightEngine();
