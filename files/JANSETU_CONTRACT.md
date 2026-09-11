# JANSETU — SHARED CONTRACT

Agree on this together before either of you opens Claude Code. If a type or function signature needs to change later, edit this file together and ping each other — don't change it quietly in your own branch. This file is what lets you merge without a rewrite.

---

## Canonical lifecycle (never create a second one)

```
SIGNAL → VALIDATING → VERIFIED → MATCHING → TEAM_FORMED → PROTOTYPE → PILOT → DEPLOYED → IMPACT_MEASURED → REUSABLE
```

Project operational state (separate, simpler):

```
DRAFT | ACTIVE | PAUSED | COMPLETED
```

## Roles (trimmed for the demo)

```
CITIZEN | UNIVERSITY | PARTNER | GOVERNMENT
```

Faculty/students are just entries inside a `Team`, not separate accounts.

---

## Core types

Put these in `types/index.ts`. Both sides import from here — nobody defines their own copy.

```ts
export type ChallengeStatus =
  | 'SIGNAL' | 'VALIDATING' | 'VERIFIED' | 'MATCHING' | 'TEAM_FORMED'
  | 'PROTOTYPE' | 'PILOT' | 'DEPLOYED' | 'IMPACT_MEASURED' | 'REUSABLE';

export interface ChallengeSummary {
  id: string;               // e.g. "JNS-1048"
  title: string;
  domain: string;           // e.g. "Water & Sanitation"
  status: ChallengeStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  signalCount: number;
  evidenceCount: number;
  confirmationCount: number;
  affectedArea: string;
  lat: number;               // approximate/generalized, never exact citizen home
  lng: number;
}

export interface ChallengeDetail extends ChallengeSummary {
  problemStatement: string;
  affectedPopulationEstimate: number;
  evidence: EvidenceItem[];
  requiredExpertise: string[];
  isDemoData: true;
}

export interface EvidenceItem {
  id: string;
  type: 'photo' | 'video' | 'voice' | 'document';
  url: string;
  caption?: string;
  submittedAt: string;
}

export interface ReportAnalysis {
  domain: string;
  domainConfidence: number;   // 0-100
  issueType: string;
  summary: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  priorityConfidence: number;
  suggestedExpertise: string[];
  source: 'live-ai' | 'saved-fallback';
}

export interface SimilarChallengeResult {
  challengeId: string;
  title: string;
  distanceKm: number;
  similarityScore: number;   // 0-100
  signalCount: number;
  status: ChallengeStatus;
}

export interface UniversityMatch {
  institutionId: string;
  institutionName: string;
  score: number;              // 0-100
  breakdown: { label: string; points: number }[]; // must sum to score
  isDemoData: true;
}

export interface PartnerMatch {
  partnerId: string;
  partnerName: string;
  score: number;
  canContribute: string[];    // e.g. ["sensors", "testing", "CSR funding"]
  isDemoData: true;
}

export interface Team {
  id: string;
  challengeId: string;
  facultyMentor: string;
  members: { name: string; discipline: string }[];
}

export interface Proposal {
  id: string;
  teamId: string;
  title: string;
  problemUnderstanding: string;
  approach: string;
  expectedImpact: string;
  prototypePlan: string;
  testingPlan: string;
  durationWeeks: number;
  estimatedCostRange: string;
}

export interface Project {
  id: string;                 // e.g. "JNP-204"
  challengeId: string;
  title: string;
  status: 'DRAFT' | 'ACTIVE' | 'PAUSED' | 'COMPLETED';
  stage: ChallengeStatus;
  milestones: Milestone[];
}

export interface Milestone {
  id: string;
  name: string;
  owner: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'DONE';
  deliverable?: string;
}

export interface PilotEvidence {
  id: string;
  projectId: string;
  type: 'test_report' | 'photo' | 'video' | 'measurement';
  url: string;
  note?: string;
}

export interface ImpactMetric {
  id: string;
  projectId: string;
  label: string;              // e.g. "People reached"
  value: string;
  source: string;
  date: string;
  method: string;
  isDemoData: true;
}

export interface SolutionSummary {
  id: string;
  title: string;
  domain: string;
  originChallengeId: string;
  similarityToCurrentChallenge?: number; // present when shown on a challenge page
}
```

---

## Functions the frontend calls (backend implements these exactly)

Names, inputs, and outputs must match exactly. This list — not a verbal agreement — is what "joining at the end" actually means.

```ts
// Citizen / reports
submitProblemReport(input: { text: string; lang: 'en'|'hi'; evidence?: File[]; lat?: number; lng?: number })
  → Promise<{ signalId: string; challengeId: string }>

analyzeReport(input: { text: string; lang?: 'en'|'hi' })
  → Promise<ReportAnalysis>

findSimilarChallenges(input: { text: string; lat?: number; lng?: number })
  → Promise<SimilarChallengeResult[]>

getMyReports(userId: string) → Promise<ChallengeSummary[]>

// Challenges
getChallenge(challengeId: string) → Promise<ChallengeDetail>

listChallenges(filters?: { domain?: string; status?: ChallengeStatus; district?: string })
  → Promise<ChallengeSummary[]>

confirmChallenge(challengeId: string, userId: string) → Promise<{ confirmationCount: number }>

verifyChallenge(challengeId: string, decision: 'VERIFIED'|'REJECTED') → Promise<ChallengeDetail>

// Matching
getUniversityMatches(challengeId: string) → Promise<UniversityMatch[]>
getPartnerMatches(challengeId: string) → Promise<PartnerMatch[]>

// Team / proposal / project
createTeam(input: { challengeId: string; facultyMentor: string; members: {name:string; discipline:string}[] })
  → Promise<Team>

submitProposal(input: Omit<Proposal, 'id'>) → Promise<Proposal>

acceptProposal(proposalId: string) → Promise<Project>

// Partner
submitPartnerOffer(input: { projectId: string; partnerId: string; contributions: string[] })
  → Promise<{ offerId: string }>

// Project
getProject(projectId: string) → Promise<Project>
updateMilestone(milestoneId: string, input: Partial<Milestone>) → Promise<Milestone>
addPilotEvidence(projectId: string, input: Omit<PilotEvidence,'id'|'projectId'>) → Promise<PilotEvidence>
getImpactMetrics(projectId: string) → Promise<ImpactMetric[]>

// Solutions
listSolutions(filters?: { domain?: string }) → Promise<SolutionSummary[]>
findRelatedSolutions(challengeId: string) → Promise<SolutionSummary[]>

// Demo auth
switchDemoRole(role: 'CITIZEN'|'UNIVERSITY'|'PARTNER'|'GOVERNMENT') → Promise<{ role: string; userId: string }>
getCurrentUser() → Promise<{ userId: string; role: string } | null>
```

---

## The rule that actually saves the merge

Every function above returns exactly this shape and nothing else — no silently-added required fields, no renamed keys. If backend needs to change a shape, they edit this file and tell frontend before pushing. If frontend needs a field that isn't here yet, it gets added here first, not invented inside a component.

## Canonical demo entity (use this everywhere so mocks and real data line up)

- Challenge `JNS-1048` — Rural Drinking Water Reliability — status `PILOT` — 17 signals, 8 evidence, 12 confirmations, 94% university match, 92% partner match
- Project `JNP-204` — Community Water Monitoring Pilot
