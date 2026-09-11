// JanSetu Shared Contract Types
// Verbatim from JANSETU_CONTRACT.md — Do NOT modify unilaterally

export type ChallengeStatus =
  | 'SIGNAL'
  | 'VALIDATING'
  | 'VERIFIED'
  | 'MATCHING'
  | 'TEAM_FORMED'
  | 'PROTOTYPE'
  | 'PILOT'
  | 'DEPLOYED'
  | 'IMPACT_MEASURED'
  | 'REUSABLE';

export type UserRole = 'CITIZEN' | 'UNIVERSITY' | 'PARTNER' | 'GOVERNMENT';

export interface ChallengeSummary {
  id: string; // e.g. "JNS-1048"
  title: string;
  domain: string; // e.g. "Water & Sanitation"
  status: ChallengeStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  signalCount: number;
  evidenceCount: number;
  confirmationCount: number;
  affectedArea: string;
  lat: number; // approximate/generalized, never exact citizen home
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
  domainConfidence: number; // 0-100
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
  similarityScore: number; // 0-100
  signalCount: number;
  status: ChallengeStatus;
}

export interface UniversityMatch {
  institutionId: string;
  institutionName: string;
  score: number; // 0-100
  breakdown: { label: string; points: number }[]; // must sum to score
  isDemoData: true;
}

export interface PartnerMatch {
  partnerId: string;
  partnerName: string;
  score: number;
  canContribute: string[]; // e.g. ["sensors", "testing", "CSR funding"]
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
  id: string; // e.g. "JNP-204"
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
  label: string; // e.g. "People reached"
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
