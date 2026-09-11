import { UniversityMatch } from '@/types';
import { SEED_UNIVERSITY_MATCHES } from '@/lib/mocks/data';
import { createServerClient } from '@/lib/supabase/server';

export async function getUniversityMatches(challengeId: string): Promise<UniversityMatch[]> {
  try {
    const supabase = createServerClient();
    const { data: dbMatches, error } = await supabase
      .from('university_matches')
      .select('*, institutions(name)')
      .eq('challenge_id', challengeId);

    if (!error && dbMatches && dbMatches.length > 0) {
      return dbMatches.map(
        (m: {
          institution_id: string;
          score: number;
          breakdown: { label: string; points: number }[];
          institutions?: { name?: string } | null;
        }) => ({
          institutionId: m.institution_id,
          institutionName: m.institutions?.name || 'Academic Institution',
          score: m.score,
          breakdown: m.breakdown,
          isDemoData: true,
        })
      );
    }
  } catch (err) {
    console.warn('Supabase university matching fallback to deterministic seed:', err);
  }

  // Return seed matches for canonical challenge JNS-1048 or default
  if (challengeId === 'JNS-1048' || SEED_UNIVERSITY_MATCHES.length > 0) {
    return SEED_UNIVERSITY_MATCHES;
  }

  // Default fallback matching adhering to Section 16 weights (summing to 94)
  return [
    {
      institutionId: 'INST-BIT-MESRA',
      institutionName: 'Birla Institute of Technology (BIT), Mesra',
      score: 94,
      breakdown: [
        { label: 'Domain Alignment (Water Chemistry & Sensing)', points: 35 },
        { label: 'Faculty Track Record (3 Environmental PhDs)', points: 25 },
        { label: 'Past Rural Interventions & Published Pilots', points: 15 },
        { label: 'Lab Instrumentation (Central Spectrophotometry)', points: 9 },
        { label: 'Geographic Proximity (Namkum / Ranchi)', points: 5 },
        { label: 'Current Semester Lab Availability', points: 5 },
      ],
      isDemoData: true,
    },
    {
      institutionId: 'INST-NIT-JSR',
      institutionName: 'National Institute of Technology (NIT), Jamshedpur',
      score: 78,
      breakdown: [
        { label: 'Domain Alignment', points: 28 },
        { label: 'Faculty Track Record', points: 20 },
        { label: 'Past Rural Interventions', points: 12 },
        { label: 'Lab Instrumentation', points: 8 },
        { label: 'Geographic Proximity', points: 3 },
        { label: 'Current Semester Lab Availability', points: 7 },
      ],
      isDemoData: true,
    },
  ];
}
