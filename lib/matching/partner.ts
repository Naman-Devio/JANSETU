import { PartnerMatch } from '@/types';
import { SEED_PARTNER_MATCHES } from '@/lib/mocks/data';
import { createServerClient } from '@/lib/supabase/server';

export async function getPartnerMatches(challengeId: string): Promise<PartnerMatch[]> {
  try {
    const supabase = createServerClient();
    const { data: dbMatches, error } = await supabase
      .from('partner_matches')
      .select('*, partners(name)')
      .eq('challenge_id', challengeId);

    if (!error && dbMatches && dbMatches.length > 0) {
      return dbMatches.map(
        (m: {
          partner_id: string;
          score: number;
          can_contribute: string[];
          partners?: { name?: string } | null;
        }) => ({
          partnerId: m.partner_id,
          partnerName: m.partners?.name || 'Industry Partner',
          score: m.score,
          canContribute: m.can_contribute || [],
          isDemoData: true,
        })
      );
    }
  } catch (err) {
    console.warn('Supabase partner matching fallback:', err);
  }

  if (challengeId === 'JNS-1048' || SEED_PARTNER_MATCHES.length > 0) {
    return SEED_PARTNER_MATCHES;
  }

  return [
    {
      partnerId: 'PRT-JUSCO',
      partnerName: 'JUSCO (Tata Steel Utilities & Infrastructure)',
      score: 92,
      canContribute: [
        'Water Quality Instrumentation & Reagents',
        'Telemetry Hardware & Low-Power Gateways',
        'Field Engineer Mentorship',
        'CSR Pilot Deployment Grant (₹3.5L)',
      ],
      isDemoData: true,
    },
    {
      partnerId: 'PRT-TSF',
      partnerName: 'Tata Steel Foundation (TSF Rural Health)',
      score: 84,
      canContribute: [
        'Jal Sahiya Grassroots Network Coordination',
        'Household Survey Infrastructure',
        'Local Governance Intermediation',
      ],
      isDemoData: true,
    },
  ];
}
