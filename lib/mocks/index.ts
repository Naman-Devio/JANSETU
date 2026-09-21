import {
  ChallengeDetail,
  ChallengeStatus,
  ChallengeSummary,
  ImpactMetric,
  Milestone,
  PartnerMatch,
  PilotEvidence,
  Project,
  Proposal,
  ReportAnalysis,
  SimilarChallengeResult,
  SolutionSummary,
  Team,
  UniversityMatch,
  UserRole,
} from '@/types';
import {
  CANONICAL_CHALLENGE,
  CANONICAL_IMPACT_METRICS,
  CANONICAL_PILOT_EVIDENCE,
  CANONICAL_PROJECT,
  FALLBACK_AI_ANALYSIS,
  SEED_CHALLENGES,
  SEED_PARTNER_MATCHES,
  SEED_SOLUTIONS,
  SEED_UNIVERSITY_MATCHES,
} from './data';

// In-memory state holding mutable items during demo session
const challengesStore: ChallengeDetail[] = JSON.parse(JSON.stringify(SEED_CHALLENGES));
const projectsStore: Project[] = [JSON.parse(JSON.stringify(CANONICAL_PROJECT))];
const pilotEvidenceStore: PilotEvidence[] = JSON.parse(JSON.stringify(CANONICAL_PILOT_EVIDENCE));
const impactMetricsStore: ImpactMetric[] = JSON.parse(JSON.stringify(CANONICAL_IMPACT_METRICS));
const solutionsStore: SolutionSummary[] = JSON.parse(JSON.stringify(SEED_SOLUTIONS));

// Session user state
let currentDemoUser: { userId: string; role: UserRole } = {
  userId: 'USR-DEMO-CITIZEN',
  role: 'CITIZEN',
};

// CITIZEN / REPORTS

/**
 * Submits a new citizen problem signal. Returns signal and assigned challenge IDs.
 */
export async function submitProblemReport(input: {
  text: string;
  lang?: string;
  title?: string;
  domain?: string;
  category?: string;
  priority?: string;
  affectedArea?: string;
  address?: string;
  evidence?: any[];
  lat?: number;
  lng?: number;
}): Promise<{ signalId: string; challengeId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 600));

  const signalId = `SIG-${Math.floor(1000 + Math.random() * 9000)}`;
  const challengeId = `JNS-${Math.floor(2000 + Math.random() * 8000)}`;

  const userEvidence = (input.evidence && Array.isArray(input.evidence) && input.evidence.length > 0)
    ? input.evidence.map((ev: any, idx: number) => ({
        id: `EV-${Date.now()}-${idx}`,
        type: (typeof ev === 'object' && ev.type && ev.type.startsWith('video')) ? ('video' as const) : ('photo' as const),
        url: typeof ev === 'string' ? ev : (ev.url || ''),
        caption: (typeof ev === 'object' && ev.title) ? ev.title : `Citizen evidence ${idx + 1}`,
        submittedAt: new Date().toISOString(),
      }))
    : [];

  const newChallenge: ChallengeDetail = {
    id: challengeId,
    title: input.title || (input.text.slice(0, 60) + (input.text.length > 60 ? '...' : '')),
    domain: input.domain || input.category || 'Water & Sanitation',
    status: 'SIGNAL',
    priority: (input.priority === 'LOW' || input.priority === 'MEDIUM') ? input.priority : 'HIGH',
    signalCount: 1,
    evidenceCount: userEvidence.length,
    confirmationCount: 1,
    affectedArea: input.affectedArea || input.address || 'Verified GPS Location',
    lat: input.lat || 23.3441,
    lng: input.lng || 85.3096,
    problemStatement: input.text,
    affectedPopulationEstimate: 2500,
    requiredExpertise: ['Civic Infrastructure', 'Rural Engineering'],
    isDemoData: true,
    evidence: userEvidence,
  };

  challengesStore.unshift(newChallenge);

  return { signalId, challengeId };
}

/**
 * Structures raw citizen text into advisory intelligence with domain and suggested priority.
 */
export async function analyzeReport(input: {
  text: string;
  lang?: 'en' | 'hi';
}): Promise<ReportAnalysis> {
  await new Promise((resolve) => setTimeout(resolve, 800));

  const lower = input.text.toLowerCase();

  if (lower.includes('road') || lower.includes('bridge') || lower.includes('culvert') || lower.includes('सड़क') || lower.includes('पुल')) {
    return {
      domain: 'Infrastructure & Access',
      domainConfidence: 91,
      issueType: 'Erosion & Physical Road Disconnection',
      summary: 'Washout or structural damage preventing safe transportation and institutional connectivity.',
      priority: 'HIGH',
      priorityConfidence: 87,
      suggestedExpertise: ['Structural Engineering', 'Geotechnical Stabilization', 'Hydraulics'],
      source: 'live-ai',
    };
  }

  if (lower.includes('waste') || lower.includes('plastic') || lower.includes('drain') || lower.includes('कचरा') || lower.includes('नाली')) {
    return {
      domain: 'Waste Management',
      domainConfidence: 89,
      issueType: 'Drainage Choking & Solid Plastic Siltation',
      summary: 'Solid unsegregated debris obstructing municipal canals and creating overflow risk.',
      priority: 'MEDIUM',
      priorityConfidence: 84,
      suggestedExpertise: ['Solid Waste Processing', 'Canal Interceptors', 'Environmental Sanitation'],
      source: 'live-ai',
    };
  }

  if (lower.includes('water') || lower.includes('borewell') || lower.includes('pipe') || lower.includes('पानी') || lower.includes('नल') || lower.includes('handpump')) {
    return {
      domain: 'Water & Sanitation',
      domainConfidence: 96,
      issueType: 'Drinking Water Contamination & Pump Failure',
      summary: 'Recurring turbidity, mineral discoloration, and intermittent supply outages in community sources.',
      priority: 'HIGH',
      priorityConfidence: 92,
      suggestedExpertise: [
        'Environmental Water Chemistry',
        'Low-Cost Adsorption Filtration',
        'IoT Telemetry & Remote Sensing',
      ],
      source: 'live-ai',
    };
  }

  return FALLBACK_AI_ANALYSIS;
}

/**
 * Identifies semantically and geographically related challenges nearby.
 */
export async function findSimilarChallenges(_input: {
  text: string;
  lat?: number;
  lng?: number;
}): Promise<SimilarChallengeResult[]> {
  await new Promise((resolve) => setTimeout(resolve, 400));

  return [
    {
      challengeId: 'JNS-1048',
      title: 'Rural Drinking Water Reliability & Multi-Village Borewell Testing',
      distanceKm: 2.4,
      similarityScore: 94,
      signalCount: 17,
      status: 'PILOT',
    },
    {
      challengeId: 'JNS-1061',
      title: 'Arsenic Hotspot Early Detection in Floodplain Shallow Tube Wells',
      distanceKm: 14.8,
      similarityScore: 68,
      signalCount: 9,
      status: 'VALIDATING',
    },
    {
      challengeId: 'JNS-1090',
      title: 'Gravity Water Intake Silt Interceptor for Hill Spring Network',
      distanceKm: 38.2,
      similarityScore: 54,
      signalCount: 16,
      status: 'REUSABLE',
    },
  ];
}

/**
 * Returns citizen-submitted reports.
 */
export async function getMyReports(_userId: string): Promise<ChallengeSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  // Return canonical and all newly created challenges
  return challengesStore.map((c) => ({
    id: c.id,
    title: c.title,
    domain: c.domain,
    status: c.status,
    priority: c.priority,
    signalCount: c.signalCount,
    evidenceCount: c.evidenceCount,
    confirmationCount: c.confirmationCount,
    affectedArea: c.affectedArea,
    lat: c.lat,
    lng: c.lng,
  }));
}

// CHALLENGES

/**
 * Returns full details for a challenge by ID.
 */
export async function getChallenge(challengeId: string): Promise<ChallengeDetail> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const found = challengesStore.find((c) => c.id === challengeId);
  if (found) return found;
  return {
    ...CANONICAL_CHALLENGE,
    id: challengeId,
    affectedArea: 'Verified GPS Location',
  };
}

/**
 * Lists challenges with optional filters.
 */
export async function listChallenges(filters?: {
  domain?: string;
  status?: ChallengeStatus;
  district?: string;
}): Promise<ChallengeSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  let items = challengesStore;

  if (filters?.domain && filters.domain !== 'ALL') {
    items = items.filter((c) => c.domain === filters.domain);
  }
  if (filters?.status) {
    items = items.filter((c) => c.status === filters.status);
  }
  if (filters?.district && filters.district !== 'ALL') {
    items = items.filter((c) => c.affectedArea.toLowerCase().includes(filters.district!.toLowerCase()));
  }

  return items.map((c) => ({
    id: c.id,
    title: c.title,
    domain: c.domain,
    status: c.status,
    priority: c.priority,
    signalCount: c.signalCount,
    evidenceCount: c.evidenceCount,
    confirmationCount: c.confirmationCount,
    affectedArea: c.affectedArea,
    lat: c.lat,
    lng: c.lng,
  }));
}

/**
 * Increments community confirmation count for a nearby citizen.
 */
export async function confirmChallenge(
  challengeId: string,
  _userId: string
): Promise<{ confirmationCount: number }> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  const found = challengesStore.find((c) => c.id === challengeId);
  if (found) {
    found.confirmationCount += 1;
    return { confirmationCount: found.confirmationCount };
  }
  return { confirmationCount: 13 };
}

/**
 * Moderator action to verify or reject a validating challenge.
 */
export async function verifyChallenge(
  challengeId: string,
  decision: 'VERIFIED' | 'REJECTED'
): Promise<ChallengeDetail> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const found = challengesStore.find((c) => c.id === challengeId);
  if (found) {
    found.status = decision === 'VERIFIED' ? 'VERIFIED' : 'SIGNAL';
    return found;
  }
  return { ...CANONICAL_CHALLENGE, status: 'VERIFIED' };
}

// MATCHING

/**
 * Returns explainable university capability matches for a challenge.
 */
export async function getUniversityMatches(_challengeId: string): Promise<UniversityMatch[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return SEED_UNIVERSITY_MATCHES;
}

/**
 * Returns industry and partner matches for a challenge.
 */
export async function getPartnerMatches(_challengeId: string): Promise<PartnerMatch[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return SEED_PARTNER_MATCHES;
}

// TEAM / PROPOSAL / PROJECT

/**
 * Creates an academic faculty-student team for a challenge.
 */
export async function createTeam(input: {
  challengeId: string;
  facultyMentor: string;
  members: { name: string; discipline: string }[];
}): Promise<Team> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    id: `TEAM-${Math.floor(100 + Math.random() * 900)}`,
    challengeId: input.challengeId,
    facultyMentor: input.facultyMentor,
    members: input.members,
  };
}

/**
 * Submits a technical proposal from a university team.
 */
export async function submitProposal(input: Omit<Proposal, 'id'>): Promise<Proposal> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    ...input,
    id: `PROP-${Math.floor(100 + Math.random() * 900)}`,
  };
}

/**
 * Approves a proposal and moves the challenge into an active project.
 */
export async function acceptProposal(_proposalId: string): Promise<Project> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const found = challengesStore.find((c) => c.id === 'JNS-1048');
  if (found) {
    found.status = 'PILOT';
  }
  return CANONICAL_PROJECT;
}

// PARTNER

/**
 * Submits an industry partner resource offer.
 */
export async function submitPartnerOffer(_input: {
  projectId: string;
  partnerId: string;
  contributions: string[];
}): Promise<{ offerId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return {
    offerId: `OFFER-${Math.floor(1000 + Math.random() * 9000)}`,
  };
}

// PROJECT

/**
 * Returns project workspace by ID.
 */
export async function getProject(projectId: string): Promise<Project> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  const found = projectsStore.find((p) => p.id === projectId);
  if (found) return found;
  return CANONICAL_PROJECT;
}

/**
 * Updates a milestone status or deliverable.
 */
export async function updateMilestone(
  milestoneId: string,
  input: Partial<Milestone>
): Promise<Milestone> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  for (const proj of projectsStore) {
    const ms = proj.milestones.find((m) => m.id === milestoneId);
    if (ms) {
      Object.assign(ms, input);
      return ms;
    }
  }
  return {
    id: milestoneId,
    name: 'Milestone Updated',
    owner: 'Project Lead',
    dueDate: '2026-10-01',
    status: input.status || 'DONE',
    deliverable: input.deliverable || 'Field Verification Verified',
  };
}

/**
 * Attaches pilot field testing evidence to a project.
 */
export async function addPilotEvidence(
  projectId: string,
  input: Omit<PilotEvidence, 'id' | 'projectId'>
): Promise<PilotEvidence> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  const newEvidence: PilotEvidence = {
    ...input,
    id: `PE-${Date.now()}`,
    projectId,
  };
  pilotEvidenceStore.unshift(newEvidence);
  return newEvidence;
}

/**
 * Returns provenance-backed impact metrics for a project.
 */
export async function getImpactMetrics(_projectId: string): Promise<ImpactMetric[]> {
  await new Promise((resolve) => setTimeout(resolve, 250));
  return impactMetricsStore;
}

// SOLUTIONS

/**
 * Lists reusable solutions catalog.
 */
export async function listSolutions(filters?: { domain?: string }): Promise<SolutionSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  if (filters?.domain && filters.domain !== 'ALL') {
    return solutionsStore.filter((s) => s.domain === filters.domain);
  }
  return solutionsStore;
}

/**
 * Returns reusable solutions matching a challenge.
 */
export async function findRelatedSolutions(challengeId: string): Promise<SolutionSummary[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return solutionsStore.filter((s) => s.originChallengeId === challengeId || (s.similarityToCurrentChallenge || 0) > 70);
}

// DEMO AUTH & ROLE SWITCHER

/**
 * Switches demo identity role among CITIZEN | UNIVERSITY | PARTNER | GOVERNMENT.
 */
export async function switchDemoRole(
  role: UserRole
): Promise<{ role: string; userId: string }> {
  await new Promise((resolve) => setTimeout(resolve, 150));
  currentDemoUser = {
    userId: `USR-DEMO-${role}`,
    role,
  };
  if (typeof window !== 'undefined') {
    localStorage.setItem('jansetu_demo_role', role);
  }
  return currentDemoUser;
}

/**
 * Returns current authenticated demo user.
 */
export async function getCurrentUser(): Promise<{ userId: string; role: string } | null> {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('jansetu_demo_role') as UserRole | null;
    if (saved) {
      currentDemoUser.role = saved;
      currentDemoUser.userId = `USR-DEMO-${saved}`;
    }
  }
  return currentDemoUser;
}
