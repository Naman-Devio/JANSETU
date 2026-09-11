# JANSETU — FINAL SIH 2026 BUILD PROMPT
## SIH26043 — Government of Jharkhand

> **ROLE OF THIS DOCUMENT:** This is the executable build specification for an AI coding agent or development team. It is intentionally optimized for a polished, credible, working **hackathon demonstration**, not for production-scale deployment. Build the smallest coherent system that convincingly demonstrates the complete JanSetu idea.

---

# 0. NON-NEGOTIABLE CONTEXT

Build **JanSetu**, a responsive web application for SIH 2026 problem statement **SIH26043**:

> “A digital platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships.”

Problem owner context: Government of Jharkhand, Department of Higher & Technical Education.

JanSetu is a **civic innovation and collaboration platform**. It is not a grievance portal, not a social network, not an AI chatbot, and not a government-portal clone.

The product thesis is:

> **Community signal → verified challenge → capability match → collaborative project → pilot/deployment → measurable impact → reusable solution.**

The app must make that chain visible and usable.

## Critical scope rule

This is a **hackathon demo**, not a production SaaS product. Do not spend implementation effort on infrastructure whose main benefit is scalability, not judge-visible capability.

Do NOT introduce Kubernetes, microservices, Kafka, Redis, Celery, a separate vector database, self-hosted LLM infrastructure, custom ML training, complex RAG, event buses, service meshes, production-grade observability stacks, or elaborate DevOps pipelines unless the existing codebase already requires them. For a fresh implementation they are explicitly out of scope.

Do NOT deploy a local LLM to the cloud. Do NOT require a GPU. Do NOT design around Ollama as a hosted runtime.

The demo must work with a normal cloud deployment and one ordinary free AI API provider. AI is called only at meaningful user actions, not on every page load. For seeded/demo records, prefer stored analysis over live AI calls. A public demo must never require live AI to navigate the core product.


---

# 1. PRODUCT IDENTITY

## Name

**JANSETU**

## Tagline

**From community signals to solutions that reach the ground.**

## Category

**Civic Innovation & Collaboration Platform**

## One-line positioning

> JanSetu transforms community signals into verified challenges, connects them with academic and industry capabilities, tracks the resulting projects from prototype to field deployment, and makes successful solutions reusable.

## Core loop

```text
DISCOVER
   ↓
UNDERSTAND
   ↓
VERIFY
   ↓
MATCH
   ↓
COLLABORATE
   ↓
BUILD
   ↓
PILOT
   ↓
DEPLOY
   ↓
MEASURE
   ↓
REUSE
```

## What JanSetu is solving

The important gap is not simply “citizens need a place to complain.” Existing grievance and civic-reporting systems already cover reporting, routing and status tracking in various forms.

JanSetu addresses the next layer:

```text
Unstructured community signal
        ↓
Evidence + community confirmation
        ↓
Structured societal challenge
        ↓
Relevant university/faculty/team
        ↓
Relevant industry/startup/CSR/resource partner
        ↓
Project + milestones + testing
        ↓
Field pilot
        ↓
Impact evidence
        ↓
Reusable solution knowledge
```

Never describe JanSetu as “replacing CPGRAMS,” “replacing municipal complaint systems,” or “solving government response.” It is a complementary innovation-coordination layer.

---

# 2. THE JUDGE TEST

The application will be judged primarily on whether a visitor can understand and experience the value chain.

A judge should be able to answer these within a few minutes:

1. What problem is JanSetu solving?
2. Why is it different from a complaint portal?
3. How does one raw community report become a useful challenge?
4. How does JanSetu identify suitable university capability?
5. How does industry contribute something concrete?
6. What happens after a proposal is accepted?
7. How is impact measured?
8. Can a successful solution be reused elsewhere?
9. Is the AI useful rather than decorative?
10. Does the product feel like a serious modern system?

If a feature does not improve one of these answers, it is not P0.

---

# 3. BUILD STRATEGY

Build one strong vertical slice first. Do not spread effort evenly across twenty modules.

## P0 — mandatory end-to-end demo

**P0 means judge-visible and demo-critical. It does not mean production-critical.**

```text
Citizen report
→ AI structuring
→ Similar challenge detection
→ Community challenge
→ Human verification
→ University match
→ University team/proposal
→ Industry contribution
→ Project timeline
→ Pilot/testing evidence
→ Impact story
→ Solution reuse
```

The government dashboard should expose and control this same lifecycle, but it should not become a giant unrelated admin system.

## P1 — useful polish only after P0 works

- Better multilingual support
- Additional map filters
- Solution adaptation flow
- Notifications
- richer project discussion
- richer evidence/document handling
- additional partner types

## P2 — explicitly future work

- live government integrations
- procurement integration
- real funding rails
- nationwide institutional capability federation
- IoT integrations
- state-to-state federation
- automated government routing
- production-scale workflow orchestration

Do not partially implement P2 features just to make the architecture look bigger.

---

# 4. THE CANONICAL LIFECYCLE

Use **one authoritative challenge lifecycle** throughout the product.

```text
SIGNAL
→ VALIDATING
→ VERIFIED
→ MATCHING
→ TEAM_FORMED
→ PROTOTYPE
→ PILOT
→ DEPLOYED
→ IMPACT_MEASURED
→ REUSABLE
```

Do not create a second competing status vocabulary elsewhere.

Project work itself can have a simple operational state:

```text
DRAFT | ACTIVE | PAUSED | COMPLETED
```

But the user-facing journey must always understand the canonical challenge lifecycle above.

Use human-readable labels:

- Signal
- Under review
- Verified challenge
- Matching
- Team formed
- Prototype
- Field pilot
- Deployed
- Impact measured
- Reusable solution

---

# 5. PRIMARY USER ROLES

Support these conceptual roles:

### Citizen / Community contributor
Can report, attach evidence, view their submissions, confirm nearby issues where permitted, and see outcomes.

### University / HEI
Can inspect matching challenges, see why the institution is relevant, create a team, submit a proposal, and manage a project.

### Faculty / Student
Can participate in an institutional team and contribute expertise or deliverables.

### Industry / Startup / MSME / CSR / Research partner
Can discover relevant projects and offer practical support such as mentorship, testing, equipment, manufacturing, technical expertise or CSR support.

### Government / Moderator
Can review signals, verify challenges, monitor the ecosystem, approve key transitions, and view impact.

For the demo, role switching may be a controlled demo selector after sign-in. It must look intentional and never imply a real government identity-verification system exists.

---

# 6. DEMO STORY — USE ONE COHERENT HERO SCENARIO

Use a **fictionalized but evidence-informed Jharkhand water-service scenario** as the main demo.

Example problem:

> Residents in a rural community report recurring concerns about drinking-water quality and reliability.

Use demo evidence such as:

- a sample photograph
- a short sample clip or poster frame
- a voice-note visualization or transcript
- approximate map location
- multiple related citizen signals

The scenario must be clearly labeled as **Demo data / fictionalized scenario** wherever appropriate.

Do not invent:

- actual citizens
- actual government endorsements
- real partnerships that do not exist
- real test results
- real field deployments
- fabricated government approvals
- fabricated sensor measurements

Use realistic content, but never imply fictional data is real evidence.

Secondary demo challenges can include:

- municipal waste
- drainage/road infrastructure
- school accessibility
- school water/sanitation
- agriculture/resource management
- environmental monitoring

The product architecture must remain general.

---

# 7. APPLICATION INFORMATION ARCHITECTURE

Keep the top-level information architecture compact.

```text
JANSETU
├── Public
│   ├── Home
│   ├── Explore Challenges
│   ├── Problem Atlas
│   ├── Solution Library
│   └── How It Works
│
├── Citizen
│   ├── Home
│   ├── Report a Problem
│   ├── My Reports
│   ├── Nearby Challenges
│   └── Activity
│
├── University
│   ├── Dashboard
│   ├── Recommended Challenges
│   ├── Challenge Detail
│   ├── Teams
│   ├── Proposals
│   └── Projects
│
├── Industry / Partner
│   ├── Dashboard
│   ├── Recommended Projects
│   └── Offers
│
└── Government / Admin
    ├── Command Center
    ├── Review Queue
    ├── Challenges
    ├── Project Pipeline
    └── Impact
```

Do not build separate pages for every conceivable entity unless the flow requires them.

---

# 8. LANDING PAGE — THE FIRST 30 SECONDS

The landing page must immediately communicate:

> **Problems are everywhere. Solutions are everywhere too. We connect them.**

Supporting text:

> JanSetu turns community signals into verified challenges, connects them with the right academic and industry capabilities, and follows the solution from first report to measurable impact.

Primary CTA:

**Report a problem**

Secondary CTA:

**Explore the atlas**

A third, quieter CTA may be:

**See how it works**

## Hero composition

Do not use a generic AI illustration.

Use a cinematic but credible civic visual treatment:

- real/open/licensed community imagery where legally usable
- a restrained map/data overlay
- concise proof points
- subtle motion
- strong typography

The hero should feel like a **living civic atlas + serious product workspace + impact story**.

Not like:

- a government template
- a startup landing-page template
- an AI generator website
- a neon cyberpunk dashboard

---

# 9. LANDING PAGE STORY SECTIONS

Build the page as a narrative, not a wall of cards.

## Section A — The signal

Show:

```text
Citizen report
+ photo
+ voice/text
+ location
        ↓
structured problem intelligence
```

Show a few concrete fields such as domain, issue type, confidence and evidence count.

## Section B — The atlas

Show the Problem Atlas as a full-width interactive map with a small number of convincing demo points.

## Section C — The match

Show:

```text
Challenge
   ↘ University capability
   ↘ Faculty/team
   ↘ Industry resource
```

## Section D — The build

Show the project lifecycle moving through:

Prototype → Pilot → Deployment.

## Section E — The impact

Show before/after evidence and metric provenance.

## Section F — Reuse

Show how a successful solution can be discovered for a similar challenge elsewhere.

## Section G — Final CTA

> Turn a community signal into something that reaches the ground.

---

# 10. CITIZEN REPORT FLOW — THE MOST IMPORTANT FORM

The citizen must not understand government bureaucracy before using the system.

Start with:

> **What did you notice?**

### Step 1 — Describe

Large, friendly text area.

Optional language selector:

- Hindi
- English

### Step 2 — Add evidence

Optional:

- Photo
- Short video
- Voice note
- Document

### Step 3 — Confirm location

Request browser location only after an explicit user action.

Allow approximate location / map adjustment.

Do not force precise location if it is not needed.

### Step 4 — Review JanSetu's understanding

Show the generated structure before submission:

- likely domain
- issue type
- concise summary
- urgency/priority suggestion
- detected location context
- related challenge warning

The citizen can correct the AI summary.

### Step 5 — Submit

Use one clear final action.

### Processing UI

Show real, short stages such as:

- Problem understood
- Evidence processed
- Similar challenges checked
- Category suggested
- Review prepared

Do not display a fake 20-second “AI analyzing particles” animation.

If AI is unavailable, show the same workflow using saved fallback analysis and a subtle note such as “Automatic analysis temporarily unavailable; you can continue manually.”

---

# 11. AI — REAL BUT SMALL AND USEFUL

AI is a supporting intelligence layer, not the product itself.

## AI responsibilities for P0

Implement only the AI capabilities that visibly improve the hero workflow:

1. Structure raw text into a challenge draft.
2. Classify domain/category.
3. Extract problem type and relevant keywords.
4. Suggest priority with an explanation.
5. Generate a short summary.
6. Suggest required expertise.
7. Optionally generate a short matching rationale.

Semantic duplicate detection may use embeddings, but it does not need an LLM.

## Do not build

- autonomous agents
- RAG pipelines
- custom model training
- autonomous government decisions
- AI moderation that silently bans users
- AI-generated “facts” treated as evidence
- an omnipresent chatbot

## AI provider strategy

Use **one hosted free-tier AI provider** for the demo, selected during setup from a provider adapter. Google Gemini Free API is a suitable default where its current free tier is available.

Do not make the architecture dependent on paid API credits.

Do not expose live AI calls to every anonymous page view. Keep AI actions intentional and server-side.

Do not run a local LLM on cloud infrastructure.

Do not require a GPU.

Do not call AI unnecessarily. AI calls should happen only on meaningful actions such as:

- “Analyze report”
- “Explain this match”
- “Summarize impact story”

For seeded demo records, **store the resulting analysis in the database** so the core judge flow can still run even if the external AI call is unavailable.

The application must not break because an AI provider fails.

## AI output discipline

AI output is advisory.

Human users must be able to edit or override classification and summary before final verification.

AI must never:

- claim an unverified health risk
- claim a government action occurred
- claim a partnership exists
- claim a field measurement exists
- convert uncertainty into certainty

Show confidence only when it represents a real, understandable scoring method.

---

# 12. SEMANTIC DUPLICATE DETECTION

This is a hero capability, but keep the implementation simple.

When a new report arrives:

```text
new report
  ↓
embedding / similarity representation
  ↓
compare with existing challenge signals
  ↓
show likely related records
```

For a small demo database, exact/vector comparison is sufficient. PostgreSQL + pgvector may be used because it keeps vector data in the same database. Do not introduce a separate vector service.

Show:

- similarity score
- approximate distance
- evidence count
- confirmation count
- current challenge status

Example:

> **3 similar community signals found nearby**

Then:

**View existing challenge**

or

**This is a different problem**

Do not automatically merge a report into a challenge without user/moderator review.

---

# 13. COMMUNITY VALIDATION

A challenge becomes stronger when multiple independent signals support it.

Show concepts such as:

- 17 related signals
- 8 evidence uploads
- 12 community confirmations
- 3 nearby locations

These are **signals of confidence**, not absolute truth.

A single report must not become a major verified challenge solely because an algorithm predicts “high priority.”

Human moderation remains the authority for verification.

---

# 14. CHALLENGE DETAIL PAGE — THE PRODUCT'S CORE OBJECT

A challenge is richer than a complaint.

The challenge page should answer:

**What is happening?**

**Where?**

**What evidence exists?**

**How many related signals exist?**

**What has been verified?**

**Why does it matter?**

**Who could help?**

**What is happening next?**

## Recommended layout

Desktop:

- Main left: evidence/story
- Main center: challenge intelligence + map/timeline
- Main right: match + current project state

Then below:

- activity
- confirmation
- metrics
- related solutions

Mobile:

- story first
- evidence next
- concise status
- matches
- timeline
- impact

Use progressive disclosure to avoid overwhelming citizens.

---

# 15. PROBLEM ATLAS

Create a flagship surface named **Problem Atlas**.

Purpose: show a living geographic view of demo challenges and their lifecycle.

Use **MapLibre GL JS** with an OSM-compatible or legally usable map source. Keep the tile/source URL configurable via environment variable.

### Map modes

- challenge density
- verified challenges
- active projects
- deployed solutions

### Filters

- district
- category
- status
- priority

### Interaction

Clicking a marker/cluster opens a side panel:

- challenge title
- report count
- evidence count
- status
- approximate affected area
- university match
- project stage
- open challenge

### Map privacy

Never expose exact citizen home coordinates in public views.

For demo/public views, use generalized or intentionally displaced point locations.

Authorized detail views may use more precise operational location where appropriate.

Always include required map attribution.

If the map cannot load, show a useful list/table alternative. The product must not become unusable because tiles are unavailable.

Error Boundaries: You must wrap the MapLibre component in a React Error Boundary. If WebGL crashes or the map tiles fail to load, the map component should gracefully fall back to a useful list/table alternative without crashing the entire Next.js application.

---

# 16. UNIVERSITY MATCHING

The platform's academic matching should feel intelligent but remain explainable.

Institution capability data should include only what is needed for the demo:

- disciplines
- departments
- expertise
- facilities
- selected past project tags
- geography/service region
- team availability

## Matching model

Use a transparent weighted score, for example:

```text
Domain expertise       35%
Faculty expertise      25%
Past project fit       15%
Facilities             10%
Location/reach          5%
Team availability      10%
```

The score must come from actual seeded fields, not random numbers.

Example:

> **94% capability match**

Then “Why this match?”

- Water systems expertise: +35
- Relevant faculty expertise: +24
- Related project history: +13
- Water testing facility: +9
- Service-region fit: +4
- Team availability: +9

The exact numbers may be tuned, but they must add up consistently.

Clearly label seeded capability records as demo/sample data when they are not verified real profiles.

---

# 17. UNIVERSITY EXPERIENCE

University dashboard headline:

> **Challenges that match what we can build.**

Prioritize:

- recommended challenges
- why the university matches
- active teams
- pending proposals
- active pilots

A challenge card should answer:

- What is the problem?
- Where is it?
- How strong is the evidence?
- Why does it matter?
- Why are we a match?
- What is needed?

## Team creation

A lightweight team can contain:

- faculty mentor
- 2–6 student contributors
- disciplines
- required capabilities

## Proposal

Fields:

- solution title
- problem understanding
- proposed approach
- expected impact
- prototype plan
- testing plan
- deployment plan
- duration
- estimated cost range
- resources requested
- industry support requested
- risks

Do not build a full procurement/funding workflow for P0.

---

# 18. INDUSTRY / PARTNER EXPERIENCE

Industry must have a reason to participate beyond “browse projects.”

Allow a partner to offer one or more:

- mentorship
- equipment
- testing
- prototyping/manufacturing
- technical expertise
- deployment support
- CSR support

Example demo partner:

> **Environmental technology partner — 92% fit**

Can contribute:

- sensor support
- testing guidance
- technical mentor

Again, mark as demo/sample data unless the partnership is actually real.

The judge should understand the partnership value within seconds.

---

# 19. PROJECT WORKSPACE

When a solution is selected, show a compact project workspace.

Use tabs:

**Overview | Milestones | Team | Testing | Impact**

Do not build an enterprise collaboration suite.

## Overview

- challenge
- team
- partner
- current stage
- objective

## Milestones

Each milestone:

- name
- owner
- due date
- status
- deliverable

## Testing

Evidence can include:

- test summary
- image
- short video
- measurement file
- community feedback

## Impact

Show approved outcome metrics only.

---

# 20. PROJECT TIMELINE

Make the lifecycle visually strong.

```text
SIGNAL
  ✓
VERIFIED
  ✓
MATCHED
  ✓
TEAM FORMED
  ✓
PROTOTYPE
  ✓
PILOT
  ●
DEPLOYED
  ○
IMPACT MEASURED
  ○
REUSABLE
```

Do not use a giant rainbow stepper.

Use a horizontal timeline on desktop and a compact vertical timeline on mobile.

Motion may highlight the current stage but must have a static equivalent.

---

# 21. IMPACT ENGINE

Impact is a core differentiator.

Do not make “number of reports” the main success metric.

Use outcome-oriented examples:

- people reached
- time saved
- cost saved
- service availability improved
- response time reduced
- accessibility improved
- resource use reduced
- coverage improved

Every displayed impact value needs a small provenance treatment:

**Source · Date · Method**

For demo records, say:

> **Demo metric — illustrative**

Do not manufacture huge “millions impacted” counters.

## Impact story layout

```text
BEFORE
↓
Problem evidence
↓
SOLUTION
↓
PILOT
↓
AFTER
↓
MEASURED OUTCOME
```

A before/after media slider is welcome where the media actually supports it.

---

# 22. SOLUTION LIBRARY

A successful project should not disappear when it finishes.

Store:

- challenge solved
- solution summary
- deployment context
- required capabilities
- implementation duration
- cost range
- outcome summary
- evidence
- adaptation notes

When a new challenge is similar:

> **Existing solution may be adaptable to this context.**

Actions:

- View solution
- Request adaptation
- Start new solution

This is how JanSetu becomes a learning network rather than only a reporting network.

---

# 23. GOVERNMENT COMMAND CENTER

Keep this focused and useful.

Main metrics:

- incoming signals
- verified challenges
- active projects
- university participation
- partner participation
- pilots
- deployments
- people reached
- reusable solutions

Main surfaces:

1. Review queue
2. Challenge pipeline
3. District/category atlas
4. Project pipeline
5. Impact overview

Use one or two strong charts, a table and a map rather than twenty metric cards.

## Review queue actions

- open signal
- inspect evidence
- view similar challenges
- verify challenge
- reject/spam
- merge as related signal

Important actions must create an audit event.

---

# 24. SEARCH AND FILTERING

Implement only useful search.

Global search for institutional users may cover:

- challenges
- projects
- universities
- partners
- solutions

Filters should be combinable.

Example:

> Water + High Priority + Ranchi + Verified + No active project

Do not build a separate search infrastructure. PostgreSQL queries are sufficient for demo scale.

---

# 25. NOTIFICATIONS

Use in-app notifications only for P0.

Relevant events:

- report submitted
- similar challenge found
- challenge verified
- university match
- proposal received
- partner offer
- milestone update
- pilot started
- impact verified

No email/SMS infrastructure is required for the core demo.

---

# 26. DATA MODEL — DEMO-SIZED, NOT ENTERPRISE-SIZED

Use PostgreSQL through Supabase.

Recommended core tables:

```text
users
roles
institutions
institution_capabilities
partners
challenges
problem_signals
evidence
challenge_confirmations
similarity_matches
verification_decisions
university_matches
partner_matches
teams
proposals
projects
milestones
pilot_evidence
impact_metrics
solutions
notifications
audit_logs
```

Do not create dozens of tables just because they might exist in a production product.

## Important relationships

- One Challenge has many Problem Signals.
- One Problem Signal can have many Evidence items.
- Challenges can reference Similarity Matches.
- One Challenge can have several University Matches and Partner Matches.
- A selected University Match can lead to a Team and Proposal.
- A Proposal can become a Project.
- Projects contain Milestones and Pilot Evidence.
- Projects contain Impact Metrics.
- A completed project may produce a Solution.
- A Solution can be related to another Challenge.

Use database constraints where useful, but do not overengineer.

---

# 27. TECH STACK — FINAL DECISION

## Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui or equivalent accessible primitives
- Framer Motion only where motion has purpose
- Recharts or equivalent for simple charts
- MapLibre GL JS

## Backend / data

**Final backend decision: use Next.js server routes/server actions + Supabase. Do not create a separate FastAPI/Python backend for this project.**

Use:

- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage
- PostgreSQL vector extension where available and useful

## AI

One hosted free-tier provider through an adapter. Default candidate: Gemini Free API.

## Hosting

Frontend: Vercel or Cloudflare, whichever is simplest for the repository.

Database/Auth/Storage: Supabase Free.

Do not introduce a paid runtime dependency.

---

# 28. ZERO-COST BUILD RULE

The project must be buildable and demonstrable without spending money.

Do not require:

- paid API credits
- paid database
- paid hosting
- paid domain
- paid map provider
- paid vector database
- paid monitoring service
- paid email service
- proprietary software license

Free plans are acceptable for the hackathon demo when used within normal free-tier limits.

The application should avoid needless API traffic, but **do not build quota-management infrastructure**. For the demo, authenticated/controlled actions plus stored seeded results are enough. This is a controlled demonstration, not an open public service.


For external services that can temporarily fail, use simple fallbacks rather than complex distributed resilience.

---

# 29. MAP / MEDIA / OPEN-SOURCE RULES

MapLibre is the rendering library.

Use a legally appropriate OSM-derived or other free map source, configured via environment variable.

Always provide visible attribution required by the selected provider.

Do not bulk-download map tiles.

For media, prefer:

- official/open-license images
- project-created media
- public-domain assets
- legally usable stock/open sources

Never present a stock or generated image as citizen evidence.

Generated imagery may be used for decorative/editorial hero backgrounds only if clearly treated as illustrative when needed.

---

# 30. INDIA-FIRST EXPERIENCE

Default language: English.

Provide Hindi-ready structure and at least the key citizen-facing labels in Hindi where practical.

Do not attempt full 22-language support in the hackathon.

The architecture should keep user-facing strings centralized so additional languages can be added later.

The citizen experience should work well on ordinary Android devices and ordinary Indian mobile connections.

Avoid heavy 3D on mobile.

---

# 31. ACCESSIBILITY

Target strong WCAG 2.2 AA quality for the demo.

Required:

- semantic HTML
- keyboard navigation
- visible focus states
- accessible forms
- explicit error messages
- sufficient contrast
- no color-only information
- meaningful alt text
- captions/transcripts for video where needed
- accessible map/list alternative
- reduced motion support
- screen-reader labels
- correct language metadata

Respect `prefers-reduced-motion`.

Every animated explanation must still make sense when animation is disabled.

---

# 32. VISUAL DESIGN DIRECTION

The product must feel like:

> **A living civic atlas + a serious product workspace + an impact storytelling platform.**

Visual references are philosophy only; do not copy proprietary designs.

Use the principles associated with contemporary products such as Linear/Vercel and premium editorial sites:

- calm hierarchy
- strong typography
- disciplined spacing
- restrained surfaces
- sharp information architecture
- high signal density
- meaningful motion

## Avoid

- Bootstrap-style old portal layouts
- excessive rounded cards
- random gradients
- rainbow metric cards
- “AI sparkles” everywhere
- robot imagery
- glowing brains
- random particle backgrounds
- giant chatbot
- fake live statistics
- fake testimonials
- fake partner logos
- decorative 3D that slows the page

## Color philosophy

Dark-first is preferred.

Base surfaces should be near-black/charcoal with off-white primary text, neutral muted text, subtle borders and restrained semantic accents.

Use semantic color sparingly:

- green = verified/success
- amber = attention/pending
- red = critical
- blue/teal = active/informational

Do not give every component a different accent color.

---

# 33. TYPOGRAPHY

Use a modern sans-serif system with excellent Latin and Devanagari support.

A reasonable stack is:

- Geist or Inter-like Latin font
- Noto Sans Devanagari for Hindi

Use:

- large editorial hero heading
- concise section titles
- compact metadata
- strong metric typography
- readable body text

Do not use tiny gray body copy.

---

# 34. MOTION SYSTEM

Motion should communicate:

- state change
- hierarchy
- causality
- navigation
- progress
- evidence transformation

Good motion examples:

- subtle page transitions
- cluster expansion on the map
- evidence reveal
- challenge-to-match relationship animation
- timeline progression
- gentle image parallax
- count-up for actual demo metrics

Avoid:

- cursor trails
- perpetual particles
- giant bouncing cards
- full-screen loading animations
- excessive blur
- gratuitous WebGL
- motion that prevents reading

Use motion as structural communication, not as decoration.

---

# 35. RESPONSIVE BEHAVIOR

## Mobile

Citizen-first, one-handed UX.

Bottom navigation may be:

**Home | Explore | Report | Activity | Profile**

The Report action should be prominent.

## Desktop

Institutional interfaces may use denser tables, split panes, side panels and command-style navigation.

The same data must remain coherent across roles.

---

# 36. PERFORMANCE

The demo should feel fast.

Use:

- optimized images
- WebP/AVIF where practical
- lazy loading below the fold
- limited third-party scripts
- route-level code splitting where helpful
- compressed video/poster frames
- lightweight animation
- map loading only when needed

Do not sacrifice core product functionality just to chase perfect Lighthouse numbers.

---

# 37. AUTHENTICATION AND DEMO ACCESS

Use Supabase Auth if authentication is needed.

For the hackathon demo, provide an obvious **Demo Mode** or seeded role selection after sign-in.

Example demo accounts can be presented as:

- Citizen Demo
- University Demo
- Partner Demo
- Government Demo

They must be clearly marked as demo identities.

Do not claim these accounts represent real institutions or officials.

---

# 38. PRIVACY AND SAFETY — APPROPRIATE TO A DEMO

Do the basics properly without turning this into a compliance project.

Required:

- collect only data necessary for the demo
- explain why location/media are collected
- avoid public exact coordinates
- avoid unnecessarily exposing phone/email
- enforce role-based page access
- protect storage paths
- validate uploads
- store audit entries for verification/admin actions
- never expose secrets in client code

Add a simple privacy/notice screen and clear demo-data language.

Do not make unverified statements such as “DPDP certified.”

Where legal/compliance language is needed, use “privacy-conscious” or “designed with data-minimization principles,” not certification claims.

---

# 39. FILE UPLOADS

Keep upload scope small.

Accept only practical demo formats:

- image
- short video
- audio
- PDF/document

Validate:

- file type
- size
- filename

Show upload progress and failure states.

A failed upload must not erase the rest of the report.

For the hackathon, simple client retry is sufficient. Do not build a distributed upload queue.

---

# 40. DEMO DATA — THE SYSTEM'S SHARED STORY

Seed a small but rich dataset.

Recommended scale:

- 8–15 challenges
- 25–50 problem signals
- 4–8 institutions
- 4–8 partner organizations
- 8–12 faculty/team profiles
- 4–8 projects
- 3–5 solutions

Make the same entities appear consistently across all views.

## Example canonical demo entity

Challenge:

**JNS-1048 — Rural Drinking Water Reliability**

Status:

**PILOT**

Signals:

**17**

Evidence items:

**8**

Community confirmations:

**12**

Primary domain:

**Water & Sanitation**

University match:

**94%**

Partner match:

**92%**

Project:

**JNP-204 — Community Water Monitoring Pilot**

Do not randomly change these numbers across screens.

If a metric changes, update the source data so every page stays consistent.

---

# 41. DEMO DATA INTEGRITY RULE

Every demo record belongs to a coherent chain:

```text
Problem Signal
   ↓
Challenge
   ↓
University Match
   ↓
Team
   ↓
Proposal
   ↓
Partner Support
   ↓
Project
   ↓
Pilot Evidence
   ↓
Impact
   ↓
Solution
```

The judge should be able to start from any node and trace the same story.

Never create disconnected fake numbers just to fill a card.

---

# 42. SEED DATA AND REAL-WORLD SOURCES

Use real public data only when attribution and interpretation are clear.

Strong context sources can include:

- CPGRAMS for understanding the mature grievance/reporting layer
- cVIGIL for evidence-based reporting patterns
- Swachhata-MoHUA for civic issue reporting
- Jal Jeevan Mission and Jharkhand water context
- CAG Jharkhand solid-waste audit
- UDISE+ education/infrastructure context
- government open-data sources

These sources inform **problem context**. They do not automatically become live JanSetu integrations.

Do not write “JanSetu is connected to CPGRAMS” unless an actual working integration exists.

---

# 43. ERROR AND EMPTY STATES

Every important surface must have:

- loading state
- success state
- empty state
- error state

Examples:

> No matching institutions found. Broaden the challenge capability requirements.

> Map unavailable. Showing nearby challenges as a list.

> AI analysis unavailable. Showing your saved draft so you can continue.

Never show raw stack traces to users.

---

# 44. FUNCTIONALITY RULE

Buttons must do something.

At minimum:

- navigation works
- filters work
- search works
- map interactions work
- report submission works
- AI analysis action works or falls back
- verification action works
- university match action works
- proposal submission works
- partner offer works
- project stage updates work
- testing evidence can be attached
- impact view reflects the project state
- solution library can be opened

Avoid dead CTA buttons labelled “Coming soon” in the main demo.

A future feature can exist in a muted “Future” area, but P0 interactions must be real.

---

# 45. SECURITY BASICS

Implement sensible demo-grade security:

- environment variables for secrets
- server-side AI API calls
- basic authorization checks
- safe database queries
- validated input
- validated uploads
- no secrets in git
- no service-role keys in browser
- audit entries for privileged state changes

Do not build a full enterprise security platform.

---

# 46. ANALYTICS / CHARTS

Use charts only when they answer a real question.

Good:

- challenge volume by domain
- verification funnel
- challenge → project funnel
- deployment rate
- impact by domain

Bad:

- decorative line charts
- fake real-time graphs
- charts with no interpretation

Every chart should have a clear label and truthful source.

---

# 47. PUBLIC IMPACT PAGE

Show a restrained overview:

- challenges received
- verified challenges
- projects developed
- pilots
- deployments
- people reached
- solutions reusable

Then show 2–4 story-led case studies.

Every case study structure:

**Problem → Evidence → Team → Prototype → Pilot → Impact**

Use real/open/licensed/illustrative media responsibly.

---

# 48. “AI-NATIVE, NOT AI-BRANDED” RULE

Do not create an “Ask JanSetu” chatbot as the homepage centerpiece.

AI should appear exactly where it helps:

- report analysis
- duplicate discovery
- expertise extraction
- match explanation
- impact summary

The product's hero is the **workflow**, not the model.

If a judge disables AI in their mind, JanSetu should still make sense as a product.

---

# 49. OPEN-SOURCE / FREE TECHNOLOGY POLICY

Prefer mature free/open technologies when they directly reduce cost or complexity.

Examples of appropriate tools:

- PostgreSQL
- pgvector
- MapLibre GL JS
- Supabase
- Tailwind
- shadcn/ui
- Recharts
- open-source media utilities

Optional domain-specific tooling may include:

- PaddleOCR for future/local OCR experimentation
- AI4Bharat IndicTrans2 for future multilingual/local translation
- OSRM or another free routing engine if routing is later needed

But do **not** integrate these simply to make the stack longer.

The correct question is:

> Does this tool materially improve the demo?

If no, do not add it.

---

# 50. TESTING — SMALL BUT REAL

Before calling the build complete, test these flows manually and with basic automated checks where practical.

## P0 acceptance criteria

### A. Citizen report

Given a user enters a problem and optional evidence/location, the system creates a Problem Signal and shows a review/analysis result.

### B. AI structuring

Given a supported text input, the system returns a structured analysis or a saved fallback result.

### C. Duplicate detection

Given a demo report similar to an existing challenge, the UI shows related challenges before merge/verification.

### D. Verification

Given moderator action, the challenge changes from VALIDATING to VERIFIED and an audit entry is created.

### E. University matching

Given a verified challenge, at least three seeded institutions can be ranked with deterministic scores and visible explanations.

### F. Team/proposal

A university demo user can create/select a team and submit a proposal.

### G. Partner contribution

A partner demo user can open the project and submit an offer.

### H. Project lifecycle

The project page shows a coherent stage timeline and milestone evidence.

### I. Impact

Approved demo metrics appear on the impact page with provenance/demo labels.

### J. Solution reuse

A completed demo project can appear in the Solution Library and be linked to a related challenge.

### K. Cross-role consistency

The same challenge/project identifiers, counts and statuses remain consistent across all role views.

### L. Responsive UI

The core citizen journey is usable on mobile width. Institutional pages are usable on desktop/tablet.

---

# 51. REVIEW AGENTS — USE THESE AS MANDATORY SELF-CRITIQUE ROLES

Before considering the implementation complete, mentally run the product through these independent reviewers. These are not separate applications to build. They are **review lenses** for the coding agent/team.

## REVIEWER A — WORLD-CLASS SOFTWARE ARCHITECT

Ask:

- Is the architecture simpler than necessary?
- Did we introduce infrastructure that does not improve the demo?
- Are responsibilities clear?
- Can the full demo run locally and in a simple cloud deployment?
- Are secrets protected?
- Are database relationships coherent?

Required outcome: remove unnecessary infrastructure.

## REVIEWER B — SENIOR PRODUCT DESIGNER

Ask:

- Can a first-time visitor understand JanSetu quickly?
- Does each screen have one primary action?
- Are the citizen and institutional experiences appropriately different?
- Is visual hierarchy strong?
- Does motion help comprehension?
- Does anything feel like a generic AI-generated template?

Required outcome: simplify and sharpen.

## REVIEWER C — SIH / INNOVATION JUDGE

Pretend you have never seen the project.

Ask:

- What is genuinely new here?
- Why is this not just a grievance portal?
- Where is the university/industry collaboration?
- Where is the problem-to-project transition?
- Where is the impact proof?
- Are we claiming things we cannot prove?
- Could the team demonstrate the system in five minutes?

Required outcome: the differentiation must be visible, not hidden in technical language.

## REVIEWER D — DATA / AI REVIEWER

Ask:

- Is AI doing a useful task?
- Can the output be explained?
- Does human review remain in control?
- Are demo values consistent?
- Are embeddings/similarity used appropriately?
- Are we calling an LLM when simple deterministic logic is better?

Required outcome: every AI feature must have a visible reason to exist.

## REVIEWER E — SECURITY / TRUST REVIEWER

Ask:

- Could a citizen's exact location leak?
- Are private files exposed?
- Are API keys server-side?
- Are uploaded files validated?
- Could demo data be mistaken for official government data?
- Does the UI overstate claims?

Required outcome: no obvious trust or privacy failure.

## REVIEWER F — DEMO / FAILURE REVIEWER

Intentionally break things:

- AI provider unavailable
- map unavailable
- empty challenge result
- failed image upload
- expired session
- slow network
- mobile viewport

The demo should degrade gracefully without collapsing.

Required outcome: the story still works.

## REVIEWER G — UX / ACCESSIBILITY REVIEWER

Check:

- keyboard navigation
- focus states
- contrast
- reduced motion
- readable type
- touch target size
- labels
- errors
- mobile usability

Required outcome: accessibility is visible in actual behavior, not only in a README.

## REVIEWER H — ANTI-HALLUCINATION / CREDIBILITY REVIEWER

Search every major claim and number in the interface.

For each ask:

> “Can we prove this?”

If not, change it to:

- demo
- illustrative
- sample
- proposed
- estimated
- or remove it.

Never fake:

- partnerships
- approvals
- government integrations
- field measurements
- user numbers
- impact numbers
- testimonials

---

# 52. FINAL PRE-SUBMISSION QUALITY GATE

Do not declare success until all of these are true:

## Product

- The value proposition is understandable in ~10 seconds.
- The product clearly differs from complaint portals.
- The full signal-to-impact journey is demonstrable.

## UX

- Citizen report is simple.
- University matching is understandable.
- Industry contribution is concrete.
- Government oversight is credible.

## Visual

- Modern 2026 product quality.
- Strong typography.
- Calm dark-first hierarchy.
- Meaningful imagery and map usage.
- No generic AI aesthetics.
- Motion is restrained and purposeful.

## Technical

- TypeScript is strict.
- Database queries are safe.
- API keys are not exposed.
- Uploads are validated.
- Role checks work.
- Loading/error/empty states exist.
- Demo fallback exists for AI.

## Integrity

- Demo data is labeled.
- No fake government endorsements.
- No fake partnerships.
- No invented measurements.
- Impact numbers have provenance.

## Performance

- Works on mobile.
- Images are optimized.
- Map is not blocking the whole application.
- No oversized video.

## Judge readiness

- There is one coherent five-minute demo path.
- Every major page reinforces the same story.
- No dead P0 buttons.
- The project can be explained without discussing infrastructure first.

---

# 53. FIVE-MINUTE SIH DEMO SCRIPT

Use this exact conceptual sequence.

## 0:00 — Start with the human problem

Open the citizen experience.

Say:

> “A community sees a recurring problem. Today, reporting it and solving it are often different journeys. JanSetu connects those journeys.”

## 0:30 — Submit the signal

Describe the water issue, attach demo evidence and location.

## 1:00 — Show intelligence

Show the structured challenge summary and the related-challenge result.

> “Instead of treating every report as an isolated complaint, JanSetu identifies that several community signals may describe the same underlying challenge.”

## 1:45 — Verify

Switch to government/moderator view.

Verify the challenge.

## 2:00 — Match

Show university matches and “Why this match?”

Then open a university workspace.

## 2:45 — Build

Create/select a multidisciplinary team and submit a proposal.

Then switch to partner view and show a practical resource offer.

## 3:30 — Pilot

Open project timeline.

Show prototype → pilot evidence.

## 4:00 — Impact

Show before/after story and provenance-backed demo metrics.

## 4:30 — Reuse

Open Solution Library.

Show that another challenge can discover the existing solution.

## 5:00 — Finish

Say:

> “JanSetu doesn’t just collect problems. It creates a pathway from a community signal to a solution that can reach the ground.”

---

# 54. JUDGE Q&A — ANSWERS THE TEAM SHOULD BE READY FOR

### “How are you different from CPGRAMS or municipal complaint systems?”

> “Those systems are primarily oriented around grievance registration and redressal. JanSetu addresses a complementary layer: converting validated societal problems into structured innovation challenges and coordinating academic and industry capabilities through development, pilot, deployment and impact.”

### “Why use AI?”

> “Community inputs are unstructured. AI helps turn them into structured challenge intelligence, identify related problems, extract required capabilities and explain matches. Human reviewers remain responsible for verification and key decisions.”

### “Is the university matching just AI-generated?”

> “No. The score comes from structured capability data such as domain expertise, faculty expertise, relevant project history, facilities, geography and availability. AI can explain the result, but the underlying match remains inspectable.”

### “Where does your university data come from?”

> “The hackathon prototype uses seeded capability records to demonstrate the model. A larger implementation would onboard and verify institutional capability data through appropriate sources and institutional participation.”

### “Are those government integrations real?”

> “Not in this prototype. The current demo is designed to prove the coordination workflow. Real government integrations are an implementation phase that would require authorization and formal interfaces.”

### “Are the impact numbers real?”

> “The demo labels illustrative values clearly. The product design requires future impact metrics to carry source, date, method and evidence.”

### “Why not deploy your own AI model?”

> “For a hackathon, hosted free-tier inference is simpler and more reliable. The product does not depend on owning a foundation model; AI is a replaceable service inside the workflow.”

### “Can this scale?”

> “The architecture is intentionally simple for the prototype. The data model separates signals, challenges, institutions, projects and solutions, so scaling infrastructure can be introduced later without changing the core product concept.”

### “Why will people actually use it?”

> “Because the citizen doesn't have to understand the institutional structure. They report what they saw, and the platform helps convert that signal into a structured challenge and connects it to people who can work on it.”

---

# 55. ENGINEERING EXECUTION ORDER

The coding agent must work in this order.

Seed demo data. (You MUST create a database seed script that inserts the exact canonical demo data for challenge "JNS-1048" as defined in Section 40, ensuring the UI renders the complete story on the first build).

## Phase 1 — Foundation

1. Initialize Next.js/TypeScript project.
2. Configure Tailwind and accessible primitives.
3. Establish design tokens.
4. Connect Supabase.
5. Create database schema.
6. Seed demo data.
7. Establish auth/demo-role mechanism.

## Phase 2 — Citizen vertical slice

8. Build landing page.
9. Build report flow.
10. Add evidence upload.
11. Add location handling.
12. Add AI analysis action.
13. Add saved AI fallback.
14. Add similarity result.

## Phase 3 — Challenge lifecycle

15. Build challenge detail.
16. Build verification flow.
17. Build Problem Atlas.
18. Build university matching.

## Phase 4 — Collaboration

19. Build university dashboard.
20. Build team/proposal flow.
21. Build partner offer flow.
22. Build project workspace.

## Phase 5 — Outcome

23. Build pilot/testing evidence.
24. Build impact page.
25. Build Solution Library.

## Phase 6 — Government view

26. Build command center.
27. Build review queue.
28. Build project/impact overview.

## Phase 7 — Polish

29. Mobile pass.
30. Accessibility pass.
31. Error/loading/empty-state pass.
32. Demo-data consistency pass.
33. Visual polish.
34. Performance pass.
35. Reviewer passes A–H.
36. Final five-minute demo rehearsal.

Do not begin Phase 5 or Phase 6 while the Phase 2 vertical slice is broken.

---

# 56. FILE / CODE ORGANIZATION

Use a maintainable but simple structure.

Suggested:

```text
app/
  (public)/
  citizen/
  university/
  partner/
  government/
  api/
components/
  ui/
  challenge/
  evidence/
  maps/
  matching/
  project/
  impact/
lib/
  supabase/
  ai/
  matching/
  validation/
  demo/
config/
types/
supabase/
  migrations/
  seed/
public/
  media/
.env.example
```

Adapt to the chosen Next.js routing structure. Do not create folders that contain no meaningful responsibility.

---

# 57. PROVIDER ABSTRACTION — ONLY WHERE IT IS CHEAP

Use a thin AI interface:

```ts
interface AIProvider {
  analyzeReport(input: ReportInput): Promise<ReportAnalysis>;
  explainMatch(input: MatchInput): Promise<string>;
}
```

Implement one real provider and one deterministic demo fallback.

Do not build a generalized “AI platform.”

Similarly, keep map configuration in one place rather than implementing a multi-provider GIS abstraction layer.

---

# 58. DATABASE / MATCHING IMPLEMENTATION GUIDANCE

Use deterministic matching where deterministic logic is sufficient.

For example:

```text
Challenge capabilities
        ↓
Compare against institution capability tags
        ↓
weighted score
        ↓
rank
        ↓
explain
```

Use AI where the input is genuinely unstructured.

This is an intentional product decision:

> **Do not use AI just because AI exists.**

---

# 59. CREDENTIALS / ENVIRONMENT VARIABLES

Use environment variables such as:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AI_PROVIDER
GEMINI_API_KEY
NEXT_PUBLIC_MAP_STYLE_URL
```

Never commit real secrets.

Do not expose service-role credentials to browser code.

Document exactly which variables are required and which are optional.

---

# 60. DEFINITION OF DONE

The build is done only when a new judge can:

1. Open the landing page.
2. Understand the idea.
3. Submit a demo problem.
4. See AI structuring.
5. See related challenges.
6. See one verified challenge.
7. See university matching and reasons.
8. See a team/proposal.
9. See a partner contribution.
10. See the project move through pilot.
11. See evidence and impact.
12. Discover a reusable solution.

The complete journey must feel like one product.

Not ten dashboards.

Not a collection of disconnected mockups.

---

# 61. FINAL COMMAND TO THE BUILDING AGENT

Build JanSetu as a **polished, credible, responsive SIH demonstration product** around one central idea:

> **A community signal should have a visible path to a solution.**

Protect the core story at every engineering decision.

Choose the simplest implementation that makes the behavior real.

Use AI where unstructured data benefits from it, and deterministic code where deterministic code is better.

Use seeded demo data to make the full story demonstrable, but label it honestly.

Make the UI look contemporary, editorial, calm and premium without becoming visually noisy.

Make the map, evidence, matching, project timeline and impact story feel like parts of one coherent system.

Do not confuse technical complexity with technical quality.

Do not confuse visual effects with product quality.

Do not confuse AI with innovation.

The standard is:

> **Simple architecture. Real interactions. Honest data. Strong product thinking. Excellent visual execution. Complete end-to-end story.**

Before presenting the work, run the eight reviewer passes in Section 51 and fix every issue they reveal.

---

# 62. REFERENCES / RESEARCH CONTEXT

These references are for validation and product context, not for pretending JanSetu has live integrations.

- SIH problem context / archives: https://sih.iqubekct.ac.in/problems/ ; https://sihbuddy.in/ps/SIH26043
- CPGRAMS: https://pgportal.gov.in/ and https://pgportal.gov.in/darpgdashboard
- cVIGIL: https://www.eci.gov.in/cvigil-app
- Swachhata-MoHUA: https://play.google.com/store/apps/details?hl=en&id=com.ichangemycity.swachhbharat
- Jharkhand Urban Development: https://jharkhand.gov.in/urban
- Jharkhand Road Construction: https://www.jharkhand.gov.in/rcd
- Jharkhand development review: https://cm.jharkhand.gov.in/node/16114
- Jharkhand drinking-water review: https://cm.jharkhand.gov.in/node/15942
- Jharkhand Economic Survey 2025-26: https://finance.jharkhand.gov.in/pdf/JES_ExecutiveSummary2025_26.pdf
- Jal Jeevan Mission functionality assessment: https://www.pib.gov.in/PressReleasePage.aspx?PRID=2220145
- CAG Jharkhand solid-waste audit: https://cag.gov.in/mab/jharkhand/en/audit-report/details/120274
- Jharkhand eProcurement: https://jharkhandtenders.gov.in/
- UDISE+: https://www.udiseplus.gov.in/
- DEPwD accessibility: https://depwd.gov.in/en/creation-of-barrier-free-environment/
- DST RDI: https://dst.gov.in/rdi-scheme/research-development-and-innovation-rdi-cell
- ANRF RDI Fund: https://www.rdifund.anrf.gov.in/
- Linear UI refresh: https://linear.app/changelog/2026-03-12-ui-refresh
- Vercel dashboard redesign: https://vercel.com/changelog/dashboard-navigation-redesign-rollout
- Figma web design trends: https://www.figma.com/resource-library/web-design-trends/
- Figma Motion: https://www.figma.com/blog/introducing-figma-motion/
- WCAG 2.2: https://www.w3.org/TR/WCAG22/
- prefers-reduced-motion: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion
- Supabase pricing/free plan: https://supabase.com/pricing
- Vercel Hobby: https://vercel.com/docs/plans/hobby
- Cloudflare Pages limits: https://developers.cloudflare.com/pages/platform/limits/
- Google Gemini API pricing: https://ai.google.dev/gemini-api/docs/pricing
- MapLibre GL JS: https://github.com/maplibre/maplibre-gl-js
- OpenStreetMap tile policy: https://operations.osmfoundation.org/policies/tiles/
- pgvector: https://github.com/pgvector/pgvector
- PaddleOCR: https://github.com/PaddlePaddle/PaddleOCR
- IndicTrans2: https://github.com/AI4Bharat/IndicTrans2
- data.gov.in: https://data.gov.in/

Use current provider documentation when implementing. Do not assume any free-tier limit is permanent; the hackathon app must not depend on a hidden paid upgrade.

---

# END
