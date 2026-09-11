# JanSetu — Backend / Data-Layer Build Prompt
### (Paste this into your Claude Code session)

You are building ONLY the backend/data layer of JanSetu inside our shared Next.js + Supabase repo. A teammate is building the UI in a parallel Claude Code session against a fixed function contract. Do NOT build or edit anything under `app/(public)`, `app/citizen`, `app/university`, `app/partner`, `app/government`, or `components/` — that's their territory. Your output is: the database, the seed data, and a working set of TypeScript functions in `lib/`.

Read these two files first, in full, before writing any code:

1. `JANSETU_FINAL_BUILD_PROMPT.md` — the full product spec. Pay special attention to:
   - Section 4 (canonical lifecycle)
   - Section 11 (AI rules — advisory only, human override, no fake certainty)
   - Section 12 (duplicate/similarity detection)
   - Section 16 (matching weights)
   - Section 26–28 (data model, tech stack decision, zero-cost rule)
   - Section 40–41 (demo data scale and the consistency chain)
   - Section 45 (security basics)
2. `JANSETU_CONTRACT.md` — the exact types and function signatures you must implement. Do not rename fields, change a return shape, or skip a function. If a signature genuinely needs to change, stop and say so instead of changing it unilaterally — we both need to know.

## Build order

1. **Supabase schema + migrations** for this trimmed table set: `users, institutions, institution_capabilities, partners, challenges, problem_signals, evidence, challenge_confirmations, similarity_matches, verification_decisions, university_matches, partner_matches, teams, proposals, projects, milestones, pilot_evidence, impact_metrics, solutions, audit_logs`. Skip a separate notifications table and full RBAC tables for now — a `role` column on `users` is enough for a demo role-switcher.

2. **Seed data script** implementing Sections 40–41: roughly 8–15 challenges, 25–50 signals, 4–8 institutions, 4–8 partners, 4–8 projects, 3–5 solutions. At least one challenge — use `JNS-1048` from the contract file — must be traceable end-to-end: signal → verified → matched → team → proposal → partner offer → project → milestones → pilot evidence → impact metric → solution. Getting this one chain airtight matters more than the total record count.

3. **AI provider adapter** (`lib/ai/`) implementing `analyzeReport`. Use the Gemini free tier behind a thin `AIProvider` interface (Section 57: `analyzeReport`, `explainMatch`). For every seeded challenge, pre-compute and store its analysis in the DB so the function can return `source: 'saved-fallback'` instantly if the live call is slow, rate-limited, or the API key is missing. The function must never throw just because the AI provider is unavailable.

4. **Deterministic matching** (`lib/matching/`) implementing `getUniversityMatches` and `getPartnerMatches` with the weighted formula from Section 16 — Domain 35%, Faculty 25%, Past projects 15%, Facilities 10%, Location 5%, Availability 10%. Scores must come from real seeded fields, and each `breakdown` array must sum to the total `score`. No random numbers.

5. **Similarity detection** (`lib/matching/` or `lib/ai/`) implementing `findSimilarChallenges` using pgvector via Supabase, per Section 12. It's a small seed dataset — don't over-tune this, just get it returning sensible nearby matches.

6. **Remaining contract functions** as server actions (`'use server'` or `app/api/*` route handlers — pick one style and stay consistent) for challenges, teams, proposals, projects, milestones, pilot evidence, impact metrics, and solutions.

7. **Demo role switcher** — implement `switchDemoRole` and `getCurrentUser` with a simple session/cookie. Section 5 and 37 describe this as a controlled demo selector, not real identity verification. Keep it simple.

## Ground rules

- Stack is locked: Next.js server actions + Supabase only. No separate backend service, no FastAPI, no Kafka/Redis/Celery/Kubernetes — Sections 0 and 28 are explicit about this and it's not up for reconsideration mid-build.
- Zero-cost only — free tiers everywhere (Section 28).
- Every function handles its own failure and returns something usable — don't let an unhandled error land in UI code that isn't yours to fix.
- Add a one-line usage example as a comment above each finished function so your teammate can wire it up without guessing at the call shape.
- Push to a `backend` branch and merge into `main` at the end of each day. Don't hold everything for one merge at the end — that's how a 4-day timeline turns into a last-night disaster.

Work through the list in order. Tell me once the seed data and the first three functions are working so I can sanity-check before continuing.
