import type { Incident, IncidentPattern, LearnedInsight } from '../types/incident';

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-027',
    title: 'Database Connection Pool Exhaustion after Config Update',
    service: 'Database Service',
    environment: 'Production',
    severity: 'critical',
    status: 'resolved',
    errorPattern: 'FATAL: remaining connection slots are reserved for non-replication superuser connections',
    logs: [
      '2026-09-24T14:22:01Z [ERROR] DB pool max connections reached (100/100).',
      '2026-09-24T14:22:05Z [WARN] Client query timeout waiting for free connection pool slot.',
      '2026-09-24T14:22:12Z [FATAL] 503 Service Unavailable downstream cascade to API Gateway.'
    ],
    recentDeployment: 'v2.8.2',
    createdAt: '2026-09-24T14:20:00Z',
    resolvedAt: '2026-09-24T14:31:00Z',
    durationMinutes: 11,
    hypotheses: [
      {
        id: 'hyp-027-1',
        title: 'Database connection-pool configuration mismatch',
        description: 'New pool size setting in v2.8.2 reduced max connections per node from 250 to 50.',
        confidence: 94,
        evidenceLevel: 'strong',
        evidenceList: [
          'Deployment v2.8.2 altered pool_size parameter in production config file',
          'Metrics show immediate pool saturation 45s post-rollout'
        ],
        relatedIncidentIds: ['INC-014']
      }
    ],
    recommendation: {
      id: 'rec-027',
      actionType: 'rollback',
      targetService: 'Database Service',
      targetVersion: 'v2.8.1',
      title: 'Rollback Database Configuration to v2.8.1',
      summary: 'Restore previous connection pool parameters (max_connections=250).',
      rationaleBullets: [
        'Symptoms began 45 seconds after v2.8.2 config deployment',
        'Matches INC-014 pool exhaustion signature',
        'Rollback restores healthy connection allocation'
      ],
      riskLevel: 'low'
    },
    remediationResult: {
      executedAt: '2026-09-24T14:29:00Z',
      actionExecuted: 'Rollback Deployment v2.8.2 to v2.8.1',
      status: 'SUCCESS',
      metricsBefore: { errorRate: '42.5%', http503Count: '184/min', p99Latency: '4200ms' },
      metricsAfter: { errorRate: '0.1%', http503Count: '0/min', p99Latency: '110ms' },
      recoveryStatus: 'RECOVERED'
    },
    lessonsLearned: [
      'Database connection pool limits must be validated against peak concurrency in staging.',
      'Deployment config changes to connection pools require automated canary verification.'
    ]
  },
  {
    id: 'INC-014',
    title: 'API Gateway Connection Pool Timeout',
    service: 'API Gateway',
    environment: 'Production',
    severity: 'high',
    status: 'resolved',
    errorPattern: 'HTTP 503 Gateway Timeout - upstream connection pool exhausted',
    logs: [
      '2026-09-12T09:15:10Z [ERROR] Upstream proxy socket pool size zero.',
      '2026-09-12T09:15:18Z [ERROR] HTTP 503 Service Unavailable returned to 4,200 clients.',
      '2026-09-12T09:16:02Z [WARN] High thread contention on worker event loop.'
    ],
    recentDeployment: 'v2.7.9',
    createdAt: '2026-09-12T09:15:00Z',
    resolvedAt: '2026-09-12T09:29:00Z',
    durationMinutes: 14,
    hypotheses: [
      {
        id: 'hyp-014-1',
        title: 'Connection configuration mismatch post-deployment',
        description: 'Upstream HTTP client pool keep-alive timeout was reduced inadvertently.',
        confidence: 91,
        evidenceLevel: 'strong',
        evidenceList: ['Keep-alive config dropped from 30s to 2s in v2.7.9 release bundle'],
        relatedIncidentIds: ['INC-009']
      }
    ],
    recommendation: {
      id: 'rec-014',
      actionType: 'config_restore',
      targetService: 'API Gateway',
      targetVersion: 'v2.7.8',
      title: 'Restore Gateway Keep-Alive Configuration',
      summary: 'Restore proxy connection keep-alive timeout to 30s.',
      rationaleBullets: [
        'Direct correlation with v2.7.9 deployment',
        'Connection creation overhead spiked CPU usage by 400%'
      ],
      riskLevel: 'low'
    },
    remediationResult: {
      executedAt: '2026-09-12T09:26:00Z',
      actionExecuted: 'Restore configuration parameter keepalive_timeout=30',
      status: 'SUCCESS',
      metricsBefore: { errorRate: '35.0%', http503Count: '140/min', p99Latency: '3500ms' },
      metricsAfter: { errorRate: '0.2%', http503Count: '1/min', p99Latency: '85ms' },
      recoveryStatus: 'RECOVERED'
    },
    lessonsLearned: [
      'Keep-alive settings in API Gateway must remain synchronized with backend timeout values.'
    ]
  },
  {
    id: 'INC-031',
    title: 'Auth Token Validation Error & Key Rotation Mismatch',
    service: 'Auth Service',
    environment: 'Production',
    severity: 'high',
    status: 'resolved',
    errorPattern: 'JWTSignaturePublicKeyNotFoundException: RSA Key ID undefined',
    logs: [
      '2026-09-28T18:04:12Z [ERROR] Failed to verify JWT signature: Kid auth-2026-key-02 not found in JWKS.',
      '2026-09-28T18:04:30Z [WARN] Rejection rate elevated to 99% for user login sessions.'
    ],
    recentDeployment: 'v1.14.0',
    createdAt: '2026-09-28T18:04:00Z',
    resolvedAt: '2026-09-28T18:18:00Z',
    durationMinutes: 14,
    hypotheses: [
      {
        id: 'hyp-031-1',
        title: 'JWKS Key Rotation Cache Invalidation Failure',
        description: 'New signing key rolled out before JWKS cache TTL expired across Auth nodes.',
        confidence: 96,
        evidenceLevel: 'strong',
        evidenceList: [
          'JWKS endpoint cached previous key set with 24h TTL',
          'Token signers immediately switched to new key pair'
        ],
        relatedIncidentIds: ['INC-019']
      }
    ],
    recommendation: {
      id: 'rec-031',
      actionType: 'cache_clear',
      targetService: 'Auth Service',
      title: 'Invalidate JWKS Key Cache & Force Key Sync',
      summary: 'Flush Redis JWKS key cache to reload public keys.',
      rationaleBullets: [
        'JWKS public key endpoint returned stale 4-hour cached response',
        'Flushing cache allows instant retrieval of newly published RSA public keys'
      ],
      riskLevel: 'low'
    },
    remediationResult: {
      executedAt: '2026-09-28T18:15:00Z',
      actionExecuted: 'Flush Redis auth:jwks:cache',
      status: 'SUCCESS',
      metricsBefore: { errorRate: '88.0%', http503Count: '0/min', p99Latency: '140ms' },
      metricsAfter: { errorRate: '0.0%', http503Count: '0/min', p99Latency: '45ms' },
      recoveryStatus: 'RECOVERED'
    },
    lessonsLearned: [
      'Key rotation automation must publish public keys 24 hours prior to active token signing switch.'
    ]
  },
  {
    id: 'INC-009',
    title: 'Payment Gateway Timeout under High Load',
    service: 'Payment Service',
    environment: 'Production',
    severity: 'medium',
    status: 'resolved',
    errorPattern: 'SocketTimeoutException: Read timed out connecting to Stripe API proxy',
    logs: [
      '2026-08-30T11:10:05Z [ERROR] Stripe outbound API request exceeded 10000ms SLA.',
      '2026-08-30T11:10:12Z [WARN] Circuit breaker OPEN for payment-provider-stripe.'
    ],
    recentDeployment: 'v3.1.0',
    createdAt: '2026-08-30T11:10:00Z',
    resolvedAt: '2026-08-30T11:22:00Z',
    durationMinutes: 12,
    hypotheses: [
      {
        id: 'hyp-009-1',
        title: 'Outbound HTTP Connection Pool Starvation',
        description: 'Synchronous payment processing blocked worker threads waiting for external HTTP sockets.',
        confidence: 89,
        evidenceLevel: 'strong',
        evidenceList: ['Worker thread pool queue length rose from 2 to 400 in 3 minutes'],
        relatedIncidentIds: ['INC-014']
      }
    ],
    recommendation: {
      id: 'rec-009',
      actionType: 'scale_out',
      targetService: 'Payment Service',
      title: 'Scale Out Payment Worker Replicas',
      summary: 'Increase payment service container replicas from 4 to 12.',
      rationaleBullets: [
        'Provides immediate capacity to drain backlog while downstream latency resolves',
        'Relieves worker thread queue saturation'
      ],
      riskLevel: 'low'
    },
    remediationResult: {
      executedAt: '2026-08-30T11:20:00Z',
      actionExecuted: 'Kubectl scale deployment payment-service --replicas=12',
      status: 'SUCCESS',
      metricsBefore: { errorRate: '19.4%', http503Count: '45/min', p99Latency: '9800ms' },
      metricsAfter: { errorRate: '0.1%', http503Count: '0/min', p99Latency: '320ms' },
      recoveryStatus: 'RECOVERED'
    },
    lessonsLearned: [
      'Asynchronous payment queue processing should replace synchronous HTTP worker threads.'
    ]
  }
];

export const INITIAL_PATTERNS: IncidentPattern[] = [
  {
    id: 'pat-1',
    category: 'Database & Connection Pools',
    title: 'Database Connection Pool Exhaustion Post-Deployment',
    description: 'Post-deployment configuration changes frequently reduce database connection pool limits, causing client thread starvation and 503 cascades.',
    incidentCount: 7,
    deploymentLinkedCount: 5,
    avgMTTR: '12m',
    commonResolution: 'Rollback connection pool configuration to previous verified parameters.',
    supportingIncidentIds: ['INC-027', 'INC-014', 'INC-009']
  },
  {
    id: 'pat-2',
    category: 'Authentication & Security',
    title: 'Auth Key Rotation & Token Cache Invalidation',
    description: 'Cryptographic key rotations or token configuration updates cause JWKS cache mismatches, rejecting valid user sessions.',
    incidentCount: 4,
    deploymentLinkedCount: 3,
    avgMTTR: '15m',
    commonResolution: 'Flush Redis JWKS key cache and trigger public key sync.',
    supportingIncidentIds: ['INC-031']
  },
  {
    id: 'pat-3',
    category: 'API Gateway & Traffic Routing',
    title: 'Gateway Keep-Alive & Timeout Mismatches',
    description: 'API Gateway updates alter upstream proxy timeouts, triggering high socket contention and HTTP 503 cascades under surge traffic.',
    incidentCount: 9,
    deploymentLinkedCount: 6,
    avgMTTR: '13m',
    commonResolution: 'Rollback Gateway deployment version or adjust upstream keep-alive timers.',
    supportingIncidentIds: ['INC-014', 'INC-027']
  }
];

export const INITIAL_LEARNED_INSIGHTS: LearnedInsight[] = [
  {
    id: 'ins-1',
    bullet: 'Database connection pool failures frequently follow deployment configuration changes.',
    category: 'database',
    confidenceScore: 96,
    supportingIncidentsCount: 7,
    createdAt: '2026-09-24T15:00:00Z'
  },
  {
    id: 'ins-2',
    bullet: 'Deployment rollback resolved 4 out of 5 connection-pool exhaustion incidents.',
    category: 'deployment',
    confidenceScore: 94,
    supportingIncidentsCount: 5,
    createdAt: '2026-09-24T15:30:00Z'
  },
  {
    id: 'ins-3',
    bullet: 'Auth Service 500/401 spikes after releases are 85% likely caused by JWKS cache TTL mismatch.',
    category: 'auth',
    confidenceScore: 91,
    supportingIncidentsCount: 4,
    createdAt: '2026-09-28T19:00:00Z'
  },
  {
    id: 'ins-4',
    bullet: 'API Gateway 503 errors correlate with backend keep-alive timer mismatches post-deploy.',
    category: 'gateway',
    confidenceScore: 93,
    supportingIncidentsCount: 6,
    createdAt: '2026-09-12T10:00:00Z'
  }
];
