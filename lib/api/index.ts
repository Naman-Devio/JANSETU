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
import * as mocks from '@/lib/mocks';

const useMocks = process.env.USE_MOCKS === 'true';

// Helper for fetch with automatic mock fallback
async function safeFetch<T>(
  url: string,
  options?: RequestInit,
  fallbackFn?: () => Promise<T>
): Promise<T> {
  if (useMocks && fallbackFn) {
    return fallbackFn();
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      if (fallbackFn) return fallbackFn();
      throw new Error(`API error ${res.status}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.warn(`safeFetch failed for ${url}, using resilient fallback:`, err);
    if (fallbackFn) return fallbackFn();
    throw err;
  }
}

// 1. CITIZEN / REPORTS
export async function submitProblemReport(input: {
  text: string;
  lang: 'en' | 'hi';
  evidence?: (File | { url: string; type?: string; title?: string })[];
  lat?: number;
  lng?: number;
}): Promise<{ signalId: string; challengeId: string }> {
  return safeFetch(
    '/api/citizen/submit',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: input.text,
        lang: input.lang,
        lat: input.lat,
        lng: input.lng,
        evidence: input.evidence,
      }),
    },
    () => mocks.submitProblemReport(input as any)
  );
}

export async function analyzeReport(input: {
  text: string;
  lang?: 'en' | 'hi';
}): Promise<ReportAnalysis> {
  return safeFetch(
    '/api/citizen/analyze',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    () => mocks.analyzeReport(input)
  );
}

export async function findSimilarChallenges(input: {
  text: string;
  lat?: number;
  lng?: number;
}): Promise<SimilarChallengeResult[]> {
  return safeFetch(
    '/api/citizen/similar',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    () => mocks.findSimilarChallenges(input)
  );
}

export async function getMyReports(userId: string): Promise<ChallengeSummary[]> {
  return safeFetch(
    `/api/citizen/reports?userId=${encodeURIComponent(userId)}`,
    undefined,
    () => mocks.getMyReports(userId)
  );
}

// 2. CHALLENGES
export async function getChallenge(challengeId: string): Promise<ChallengeDetail> {
  return safeFetch(
    `/api/challenges/${challengeId}`,
    undefined,
    () => mocks.getChallenge(challengeId)
  );
}

export async function listChallenges(filters?: {
  domain?: string;
  status?: ChallengeStatus;
  district?: string;
}): Promise<ChallengeSummary[]> {
  const params = new URLSearchParams();
  if (filters?.domain) params.set('domain', filters.domain);
  if (filters?.status) params.set('status', filters.status);
  if (filters?.district) params.set('district', filters.district);

  return safeFetch(
    `/api/challenges?${params.toString()}`,
    undefined,
    () => mocks.listChallenges(filters)
  );
}

export async function confirmChallenge(
  challengeId: string,
  userId: string
): Promise<{ confirmationCount: number }> {
  return safeFetch(
    `/api/challenges/${challengeId}/confirm`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    },
    () => mocks.confirmChallenge(challengeId, userId)
  );
}

export async function verifyChallenge(
  challengeId: string,
  decision: 'VERIFIED' | 'REJECTED'
): Promise<ChallengeDetail> {
  return safeFetch(
    `/api/challenges/${challengeId}/verify`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ decision }),
    },
    () => mocks.verifyChallenge(challengeId, decision)
  );
}

// 3. MATCHING
export async function getUniversityMatches(challengeId: string): Promise<UniversityMatch[]> {
  return safeFetch(
    `/api/challenges/${challengeId}/matches?type=university`,
    undefined,
    () => mocks.getUniversityMatches(challengeId)
  );
}

export async function getPartnerMatches(challengeId: string): Promise<PartnerMatch[]> {
  return safeFetch(
    `/api/challenges/${challengeId}/matches?type=partner`,
    undefined,
    () => mocks.getPartnerMatches(challengeId)
  );
}

// 4. TEAM / PROPOSALS / PROJECTS
export async function createTeam(input: {
  challengeId: string;
  facultyMentor: string;
  members: { name: string; discipline: string }[];
}): Promise<Team> {
  return safeFetch(
    '/api/teams',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    () => mocks.createTeam(input)
  );
}

export async function submitProposal(input: Omit<Proposal, 'id'>): Promise<Proposal> {
  return safeFetch(
    '/api/proposals',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    () => mocks.submitProposal(input)
  );
}

export async function acceptProposal(proposalId: string): Promise<Project> {
  return safeFetch(
    `/api/proposals/${proposalId}/accept`,
    { method: 'POST' },
    () => mocks.acceptProposal(proposalId)
  );
}

export async function submitPartnerOffer(input: {
  projectId: string;
  partnerId: string;
  contributions: string[];
}): Promise<{ offerId: string }> {
  return safeFetch(
    '/api/partner/offer',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    () => mocks.submitPartnerOffer(input)
  );
}

export async function getProject(projectId: string): Promise<Project> {
  return safeFetch(
    `/api/projects/${projectId}`,
    undefined,
    () => mocks.getProject(projectId)
  );
}

export async function updateMilestone(
  milestoneId: string,
  input: Partial<Milestone>
): Promise<Milestone> {
  return safeFetch(
    `/api/projects/unknown/milestones`,
    {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ milestoneId, ...input }),
    },
    () => mocks.updateMilestone(milestoneId, input)
  );
}

export async function addPilotEvidence(
  projectId: string,
  input: Omit<PilotEvidence, 'id' | 'projectId'>
): Promise<PilotEvidence> {
  return safeFetch(
    `/api/projects/${projectId}/evidence`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    },
    () => mocks.addPilotEvidence(projectId, input)
  );
}

export async function getImpactMetrics(projectId: string): Promise<ImpactMetric[]> {
  return safeFetch(
    `/api/projects/${projectId}/impact`,
    undefined,
    () => mocks.getImpactMetrics(projectId)
  );
}

// 5. SOLUTIONS
export async function listSolutions(filters?: { domain?: string }): Promise<SolutionSummary[]> {
  const params = new URLSearchParams();
  if (filters?.domain) params.set('domain', filters.domain);
  return safeFetch(
    `/api/solutions?${params.toString()}`,
    undefined,
    () => mocks.listSolutions(filters)
  );
}

export async function findRelatedSolutions(challengeId: string): Promise<SolutionSummary[]> {
  return safeFetch(
    `/api/solutions?challengeId=${encodeURIComponent(challengeId)}`,
    undefined,
    () => mocks.findRelatedSolutions(challengeId)
  );
}

// 6. DEMO AUTH
export async function switchDemoRole(
  role: UserRole
): Promise<{ role: string; userId: string }> {
  return safeFetch(
    '/api/auth/role',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role }),
    },
    () => mocks.switchDemoRole(role)
  );
}

export async function getCurrentUser(): Promise<{ userId: string; role: string } | null> {
  return safeFetch(
    '/api/auth/role',
    undefined,
    () => mocks.getCurrentUser()
  );
}
