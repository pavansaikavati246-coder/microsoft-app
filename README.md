# IncidentIQ — Autonomous Incident Intelligence & Response Agent

> **"Every Incident Teaches the Agent."**

**IncidentIQ** is an AI-powered Production Incident Intelligence and Response platform built for modern engineering teams. Its central core capability is an **AI Incident Response Agent powered by Persistent Hindsight Memory**.

Unlike generic chatbot assistants that produce stateless guesses, **IncidentIQ** maintains a persistent vector memory index of historical production incidents, root-cause analyses, human approval decisions, verified remediation outcomes, and postmortem lessons learned.

---

![IncidentIQ Architecture](/incidentiq_architecture_diagram_1790645231596.jpg)

---

## 🌟 Key Features

### 1. Persistent Hindsight Memory Engine
* **Contextual Similarity Matching**: Computes contextual similarity percentages (e.g., INC-027 92% match) across service signatures, deployment timings, error logs, and stack traces.
* **Organizational Learning**: Every resolved incident automatically persists postmortem lessons into Hindsight memory to accelerate future triage.
* **"What the Agent Learned"**: Real-time dashboard summarizing accumulated institutional intelligence.

### 2. Autonomous AI Agent Workspace (Not a Chatbot!)
* **Real Agent Tool Execution**: The agent calls specialized tool primitives:
  * `extract_incident_context()`
  * `search_historical_incidents()`
  * `analyze_error_logs()`
  * `get_recent_deployments()`
  * `formulate_root_cause_hypotheses()`
  * `recommend_resolution()`
  * `execute_remediation()`
  * `verify_incident_status()`
  * `record_incident_outcome()`
* **Structured Workspace**: Displays context cards, live tool trace steps, confidence progress bars, and rationale bullets (`WHY THIS ACTION?`).

### 3. Human-in-the-Loop Safety Gate
* **No Blind Destructive Actions**: Every proposed production fix requires explicit human authorization (`[ Approve Action ]`, `[ Reject ]`, `[ Investigate Further ]`).

### 4. Post-Action Metric Verification & Recovery
* **Real-time Metric Tracking**: Measures before/after metric recovery (e.g. Error Rate 38.4% → 0.1%, 503 Count 124/min → 0/min, Status: RECOVERED).

### 5. Proof of Memory (Before vs After Comparison)
* **Interactive Proof Tab**: Side-by-side comparison demonstrating how stateless generic AI vs Hindsight-boosted AI analyze the exact same incident.

### 6. Failure Taxonomy & Topology Graph
* **Recurring Incident Patterns**: Clusters recurring failures (e.g., Database Connection Pool Exhaustion, Auth JWKS Key Mismatch).
* **Interactive Memory Graph**: Visual vector network connecting incidents, root causes, and verified fixes.

---

## 🚀 The Hero Demo Story (60-90 Seconds)

1. **Scene 1 — Intake**: Incident `INC-032` (API Gateway 503 post v2.8.4 deployment) is created.
2. **Scene 2 — Investigation**: Agent executes tool calls to scan error signatures and git commits.
3. **Scene 3 — Hindsight Search**: Hindsight locates `INC-027` (92% match) and `INC-014` (87% match).
4. **Scene 4 — Pattern Matching**: Identifies post-deployment connection pool limit saturation.
5. **Scene 5 — Structured Recommendation**: Agent recommends: *"Rollback API Gateway Deployment v2.8.4"*.
6. **Scene 6 — Human Approval**: SRE engineer reviews rationale bullets and clicks `Approve Action`.
7. **Scene 7 — Remediation**: Simulated Kubernetes config rollback executes.
8. **Scene 8 — Verification**: Error rates drop from 38.4% → 0.1% (RECOVERED).
9. **Scene 9 — Memory Update**: Postmortem lessons indexed into persistent Hindsight memory.
10. **Scene 10 — Second Incident**: Triggering `INC-038` yields an instant zero-delay 98% memory fix!

---

## 🛠️ Technology Stack

* **Frontend Framework**: React (TypeScript) + Vite
* **Styling**: Modern CSS with Tailwind CSS v4, Lucide Icons & Custom Neon Glow utilities
* **State & Persistence**: LocalStorage Hindsight Engine Vector Index
* **Animations**: Canvas Confetti & Micro-interactions

---

## 💻 Quick Start & Running Locally

```bash
# Clone the repository
git clone https://github.com/incidentiq/incidentiq-agent.git
cd incidentiq-agent

# Install dependencies
npm install

# Run the development server
npm run dev

# Build production bundle
npm run build
```

---

## 🏷️ Tagline

**Every Incident Teaches the Agent.**
`Experience → Remember → Reason → Act → Verify → Learn → Improve`
