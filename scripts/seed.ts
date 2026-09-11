import { createClient } from '@supabase/supabase-js';
import {
  SEED_CHALLENGES,
  CANONICAL_PROJECT,
  CANONICAL_PILOT_EVIDENCE,
  CANONICAL_IMPACT_METRICS,
  SEED_SOLUTIONS,
  SEED_UNIVERSITY_MATCHES,
  SEED_PARTNER_MATCHES,
} from '../lib/mocks/data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://krsnyparzepoyuatfumw.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required to run seed script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('Seeding JanSetu database at', supabaseUrl);

  // 1. Seed Users
  const users = [
    { id: 'USR-DEMO-CITIZEN', role: 'CITIZEN' },
    { id: 'USR-DEMO-UNIVERSITY', role: 'UNIVERSITY' },
    { id: 'USR-DEMO-PARTNER', role: 'PARTNER' },
    { id: 'USR-DEMO-GOVERNMENT', role: 'GOVERNMENT' },
  ];
  await supabase.from('users').upsert(users);
  console.log('✔ Users seeded');

  // 2. Seed Challenges
  const challengesToInsert = SEED_CHALLENGES.map((ch) => ({
    id: ch.id,
    title: ch.title,
    domain: ch.domain,
    status: ch.status,
    priority: ch.priority,
    signal_count: ch.signalCount,
    evidence_count: ch.evidenceCount,
    confirmation_count: ch.confirmationCount,
    affected_area: ch.affectedArea,
    lat: ch.lat,
    lng: ch.lng,
    problem_statement: ch.problemStatement,
    affected_population_estimate: ch.affectedPopulationEstimate,
    required_expertise: ch.requiredExpertise,
    is_demo_data: true,
  }));
  await supabase.from('challenges').upsert(challengesToInsert);
  console.log('✔ Challenges seeded');

  // 3. Seed Evidence
  for (const ch of SEED_CHALLENGES) {
    if (ch.evidence && ch.evidence.length > 0) {
      const evs = ch.evidence.map((e) => ({
        id: e.id,
        challenge_id: ch.id,
        type: e.type,
        url: e.url,
        caption: e.caption,
      }));
      await supabase.from('evidence').upsert(evs);
    }
  }
  console.log('✔ Evidence seeded');

  // 4. Seed Institutions & Matches
  const institutions = [
    { id: 'INST-BIT-MESRA', name: 'Birla Institute of Technology (BIT), Mesra', district: 'Ranchi' },
    { id: 'INST-NIT-JSR', name: 'National Institute of Technology (NIT), Jamshedpur', district: 'East Singhbhum' },
    { id: 'INST-IIT-ISM', name: 'IIT (ISM) Dhanbad', district: 'Dhanbad' },
  ];
  await supabase.from('institutions').upsert(institutions);

  const records = SEED_UNIVERSITY_MATCHES.map((m) => ({
    id: `UM-JNS-1048-${m.institutionId}`,
    challenge_id: 'JNS-1048',
    institution_id: m.institutionId,
    score: m.score,
    breakdown: m.breakdown,
    is_demo_data: true,
  }));
  await supabase.from('university_matches').upsert(records);
  console.log('✔ Institutions & University matches seeded');

  // 5. Seed Partners & Matches
  const partners = [
    { id: 'PRT-JUSCO', name: 'JUSCO (Tata Steel Utilities & Infrastructure)' },
    { id: 'PRT-TSF', name: 'Tata Steel Foundation (TSF Rural Health)' },
  ];
  await supabase.from('partners').upsert(partners);

  const partnerRecords = SEED_PARTNER_MATCHES.map((m) => ({
    id: `PM-JNS-1048-${m.partnerId}`,
    challenge_id: 'JNS-1048',
    partner_id: m.partnerId,
    score: m.score,
    can_contribute: m.canContribute,
    is_demo_data: true,
  }));
  await supabase.from('partner_matches').upsert(partnerRecords);
  console.log('✔ Partners & Partner matches seeded');

  // 6. Seed Project JNP-204
  await supabase.from('projects').upsert({
    id: CANONICAL_PROJECT.id,
    challenge_id: CANONICAL_PROJECT.challengeId,
    title: CANONICAL_PROJECT.title,
    status: CANONICAL_PROJECT.status,
    stage: CANONICAL_PROJECT.stage,
  });

  // 7. Seed Milestones
  const milestones = CANONICAL_PROJECT.milestones.map((m) => ({
    id: m.id,
    project_id: CANONICAL_PROJECT.id,
    name: m.name,
    owner: m.owner,
    due_date: m.dueDate,
    status: m.status,
    deliverable: m.deliverable,
  }));
  await supabase.from('milestones').upsert(milestones);
  console.log('✔ Project & Milestones seeded');

  // 8. Seed Pilot Evidence
  const pilotEv = CANONICAL_PILOT_EVIDENCE.map((pe) => ({
    id: pe.id,
    project_id: pe.projectId,
    type: pe.type,
    url: pe.url,
    note: pe.note,
  }));
  await supabase.from('pilot_evidence').upsert(pilotEv);
  console.log('✔ Pilot evidence seeded');

  // 9. Seed Impact Metrics
  const impact = CANONICAL_IMPACT_METRICS.map((im) => ({
    id: im.id,
    project_id: im.projectId,
    label: im.label,
    value: im.value,
    source: im.source,
    date: im.date,
    method: im.method,
    is_demo_data: true,
  }));
  await supabase.from('impact_metrics').upsert(impact);
  console.log('✔ Impact metrics seeded');

  // 10. Seed Solutions
  const solutions = SEED_SOLUTIONS.map((s) => ({
    id: s.id,
    title: s.title,
    domain: s.domain,
    origin_challenge_id: s.originChallengeId,
    similarity_to_current_challenge: s.similarityToCurrentChallenge || 0,
  }));
  await supabase.from('solutions').upsert(solutions);
  console.log('✔ Solutions catalog seeded');

  console.log('🎉 JanSetu DB seeding complete!');
}

seed().catch(console.error);
