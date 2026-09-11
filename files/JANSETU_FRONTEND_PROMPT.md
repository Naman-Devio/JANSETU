# JanSetu — Frontend / UI Build Prompt
### (Paste this into your Claude Code session)

You are building ONLY the UI layer of JanSetu inside our shared Next.js + Supabase repo. A teammate is building the database, seed data, and backend logic in a parallel Claude Code session against a fixed function contract. Do NOT build or edit anything under `lib/supabase`, `lib/ai`, `lib/matching`, or `supabase/migrations` — that's their territory. Your output is: every page, every component, and the full visual system.

Read these two files first, in full, before writing any code:

1. `JANSETU_FINAL_BUILD_PROMPT.md` — the full product spec. Pay special attention to:
   - Section 7–10 (information architecture, landing page, citizen report flow)
   - Section 14–23 (challenge detail, Problem Atlas, matching display, university/partner/project/impact/solutions/government screens)
   - Section 30–36 (India-first experience, accessibility, visual design, typography, motion, responsive behavior)
   - Section 43–44 (error/empty states, the functionality rule — no dead buttons)
2. `JANSETU_CONTRACT.md` — the exact types and function signatures your UI must consume. Every page you build should call a function from this contract — never invent your own data shape for something the contract already defines.

## Don't wait on your teammate

Until backend functions are ready, create `lib/mocks/` with hand-written implementations of every function listed in the contract, returning realistic fake data that matches the types exactly. Base your fake data on the canonical demo entity in the contract file (challenge `JNS-1048`, project `JNP-204`). Import from `lib/mocks` everywhere for now.

When your teammate's real functions land, swapping the import path should be the only change needed. If it turns out to be more than that, the mock's shape drifted from the contract — that's the first thing to check, not a UI bug.

## Build order (matches the 5-minute demo script in Section 53)

1. Landing page (Section 8–9) — pure UI, no backend function needed, build this first.
2. Citizen report flow (Section 10) — the 5-step flow, calling `submitProblemReport`, `analyzeReport`, `findSimilarChallenges`.
3. Challenge detail page (Section 14) + Problem Atlas (Section 15, MapLibre GL JS).
4. University matching display (Section 16–17) with the "why this match" breakdown, plus team/proposal forms.
5. Partner offer screen (Section 18).
6. Project workspace + timeline (Section 19–20), milestone list, pilot evidence upload UI.
7. Impact page (Section 21) with provenance labels, and Solution Library (Section 22).
8. Government review queue + a trimmed command center (Section 23) — just Review Queue + reuse of the Atlas + two simple charts, not the full five-surface version.

## Visual bar

Calm dark-first hierarchy, strong typography, restrained motion (Sections 32–34). No generic AI-template look, no dead buttons — every button calls a real (or mocked) function. Respect `prefers-reduced-motion`. Mobile-first for citizen screens, desktop-first for institutional ones (Section 35).

## Ground rules

- Every screen needs loading/empty/error states (Section 43) — including "Automatic analysis temporarily unavailable, showing your saved draft" as a real, designed state, not an afterthought.
- Push to a `frontend` branch and merge into `main` at the end of each day. Don't hold everything for one merge at the end.
- When you swap a mock for a real function and something breaks, check `JANSETU_CONTRACT.md` first. The fix is almost always a shape mismatch, not a UI bug.

Work through the list in order, matching the demo script in Section 53. Tell me once the citizen report flow works end-to-end (even against mocks) before moving to challenge detail.
