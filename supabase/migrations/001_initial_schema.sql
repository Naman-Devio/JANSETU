-- ====================================================================
-- JANSETU — Initial Database Schema Migration (SIH 2026 / SIH26043)
-- ====================================================================

-- 1. Enable pgvector extension for societal challenge similarity detection
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. USERS
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'CITIZEN',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CHALLENGES
CREATE TABLE IF NOT EXISTS challenges (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SIGNAL',
  priority TEXT NOT NULL DEFAULT 'MEDIUM',
  signal_count INTEGER NOT NULL DEFAULT 1,
  evidence_count INTEGER NOT NULL DEFAULT 0,
  confirmation_count INTEGER NOT NULL DEFAULT 0,
  affected_area TEXT NOT NULL,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  problem_statement TEXT NOT NULL,
  affected_population_estimate INTEGER NOT NULL DEFAULT 0,
  required_expertise TEXT[] NOT NULL DEFAULT '{}',
  cached_analysis JSONB,
  embedding VECTOR(768),
  is_demo_data BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PROBLEM SIGNALS
CREATE TABLE IF NOT EXISTS problem_signals (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE SET NULL,
  user_id TEXT,
  text TEXT NOT NULL,
  lang TEXT NOT NULL DEFAULT 'en',
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. EVIDENCE
CREATE TABLE IF NOT EXISTS evidence (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  caption TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. CHALLENGE CONFIRMATIONS
CREATE TABLE IF NOT EXISTS challenge_confirmations (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  confirmed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VERIFICATION DECISIONS
CREATE TABLE IF NOT EXISTS verification_decisions (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE CASCADE,
  verifier_id TEXT,
  decision TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. INSTITUTIONS
CREATE TABLE IF NOT EXISTS institutions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT,
  domains TEXT[] DEFAULT '{}',
  facilities TEXT[] DEFAULT '{}',
  faculty_count INTEGER DEFAULT 0,
  past_project_count INTEGER DEFAULT 0,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION
);

-- 9. INSTITUTION CAPABILITIES
CREATE TABLE IF NOT EXISTS institution_capabilities (
  id TEXT PRIMARY KEY,
  institution_id TEXT REFERENCES institutions(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  faculty_name TEXT,
  specialization TEXT,
  lab_facility TEXT
);

-- 10. UNIVERSITY MATCHES
CREATE TABLE IF NOT EXISTS university_matches (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE CASCADE,
  institution_id TEXT REFERENCES institutions(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  breakdown JSONB NOT NULL,
  is_demo_data BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. PARTNERS
CREATE TABLE IF NOT EXISTS partners (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domains TEXT[] DEFAULT '{}',
  contribution_types TEXT[] DEFAULT '{}',
  csr_focus TEXT
);

-- 12. PARTNER MATCHES
CREATE TABLE IF NOT EXISTS partner_matches (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE CASCADE,
  partner_id TEXT REFERENCES partners(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  can_contribute TEXT[] NOT NULL DEFAULT '{}',
  is_demo_data BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TEAMS
CREATE TABLE IF NOT EXISTS teams (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE CASCADE,
  faculty_mentor TEXT NOT NULL,
  members JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 14. PROPOSALS
CREATE TABLE IF NOT EXISTS proposals (
  id TEXT PRIMARY KEY,
  team_id TEXT REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  problem_understanding TEXT,
  approach TEXT,
  expected_impact TEXT,
  prototype_plan TEXT,
  testing_plan TEXT,
  duration_weeks INTEGER DEFAULT 12,
  estimated_cost_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. PROJECTS
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  challenge_id TEXT REFERENCES challenges(id) ON DELETE CASCADE,
  proposal_id TEXT REFERENCES proposals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE',
  stage TEXT NOT NULL DEFAULT 'PILOT',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 16. MILESTONES
CREATE TABLE IF NOT EXISTS milestones (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  owner TEXT NOT NULL,
  due_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING',
  deliverable TEXT
);

-- 17. PILOT EVIDENCE
CREATE TABLE IF NOT EXISTS pilot_evidence (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. IMPACT METRICS
CREATE TABLE IF NOT EXISTS impact_metrics (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  source TEXT NOT NULL,
  date TEXT NOT NULL,
  method TEXT NOT NULL,
  is_demo_data BOOLEAN NOT NULL DEFAULT TRUE
);

-- 19. SOLUTIONS
CREATE TABLE IF NOT EXISTS solutions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  domain TEXT NOT NULL,
  origin_challenge_id TEXT REFERENCES challenges(id) ON DELETE SET NULL,
  similarity_to_current_challenge INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. SIMILARITY MATCHES & AUDIT LOGS
CREATE TABLE IF NOT EXISTS similarity_matches (
  id TEXT PRIMARY KEY,
  source_id TEXT,
  matched_id TEXT,
  similarity_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  action TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Grant public read/write for hackathon demo simplicity
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE challenges DISABLE ROW LEVEL SECURITY;
ALTER TABLE problem_signals DISABLE ROW LEVEL SECURITY;
ALTER TABLE evidence DISABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_confirmations DISABLE ROW LEVEL SECURITY;
ALTER TABLE verification_decisions DISABLE ROW LEVEL SECURITY;
ALTER TABLE institutions DISABLE ROW LEVEL SECURITY;
ALTER TABLE institution_capabilities DISABLE ROW LEVEL SECURITY;
ALTER TABLE university_matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE partners DISABLE ROW LEVEL SECURITY;
ALTER TABLE partner_matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE teams DISABLE ROW LEVEL SECURITY;
ALTER TABLE proposals DISABLE ROW LEVEL SECURITY;
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE milestones DISABLE ROW LEVEL SECURITY;
ALTER TABLE pilot_evidence DISABLE ROW LEVEL SECURITY;
ALTER TABLE impact_metrics DISABLE ROW LEVEL SECURITY;
ALTER TABLE solutions DISABLE ROW LEVEL SECURITY;
ALTER TABLE similarity_matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
