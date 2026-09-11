import { ChallengeStatus, SimilarChallengeResult } from '@/types';
import { SEED_CHALLENGES } from '@/lib/mocks/data';
import { createServerClient } from '@/lib/supabase/server';

function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export async function findSimilarChallenges(input: {
  text: string;
  lat?: number;
  lng?: number;
}): Promise<SimilarChallengeResult[]> {
  const userLat = input.lat || 23.3364;
  const userLng = input.lng || 85.3475;
  const lowerText = input.text.toLowerCase();

  try {
    const supabase = createServerClient();
    const { data: dbChallenges, error } = await supabase
      .from('challenges')
      .select('*')
      .limit(10);

    if (!error && dbChallenges && dbChallenges.length > 0) {
      return dbChallenges
        .map(
          (ch: {
            id: string;
            title: string;
            domain: string;
            status: ChallengeStatus;
            signal_count: number;
            lat: number;
            lng: number;
          }) => {
            const dist = calculateHaversineKm(userLat, userLng, ch.lat, ch.lng);
            let score = 50;
            if (
              lowerText.includes('water') ||
              lowerText.includes('पानी') ||
              lowerText.includes('बोरवेल')
            ) {
              if (ch.domain === 'Water & Sanitation') score += 35;
            }
            if (dist < 15) score += 10;
            return {
              challengeId: ch.id,
              title: ch.title,
              distanceKm: dist,
              similarityScore: Math.min(score, 94),
              signalCount: ch.signal_count || 1,
              status: ch.status,
            };
          }
        )
        .filter((r) => r.similarityScore >= 65)
        .sort((a, b) => b.similarityScore - a.similarityScore);
    }
  } catch (err) {
    console.warn('Supabase similarity detection fallback:', err);
  }

  // Resilient fallback across seed challenges
  return SEED_CHALLENGES.map((ch) => {
    const dist = calculateHaversineKm(userLat, userLng, ch.lat, ch.lng);
    let sim = 60;
    if (lowerText.includes('water') || lowerText.includes('पानी') || lowerText.includes('turbid') || lowerText.includes('बोरवेल')) {
      if (ch.domain === 'Water & Sanitation') sim = 88;
    }
    return {
      challengeId: ch.id,
      title: ch.title,
      distanceKm: dist,
      similarityScore: sim,
      signalCount: ch.signalCount,
      status: ch.status,
    };
  })
    .filter((r) => r.similarityScore >= 70)
    .slice(0, 3);
}
