# Texas United Mortgage — Funnel Context

## Project Overview
High-conversion mortgage lead funnel for Texas United's website. Collects 7 answers from the user (loan purpose is pre-selected via landing page buttons), gates results behind a lead-capture form, then reveals personalized live rate cards with PDF download. Frontend-only (v1 — no backend; form data stays in React state).

**Live URL:** https://texasunited-funnel.vercel.app
**GitHub:** https://github.com/jcsreenivasan/Texasunited-funnel
**Vercel Team:** jcsreenivasans-projects

---

## Tech Stack
| Tool | Version | Purpose |
|---|---|---|
| React 18 + Vite | Latest | SPA |
| TypeScript | Latest | Type safety (`verbatimModuleSyntax` ON — always use `import type`) |
| Tailwind CSS | v3 | Styling |
| Framer Motion | Latest | Animations, modal, step transitions |
| Lucide React | Latest | Icons |
| jsPDF | Latest | PDF rate sheet generation |
| html2canvas | Latest | (installed, not actively used) |

---

## Brand Colors
- **Primary red:** `#EA2523` — CTAs, selections, accents
- **Primary navy:** `#233B86` — headers, secondary buttons, trust elements
- Not limited to these — other colors used per step for variety (indigo, teal, amber, emerald, etc.)

---

## Funnel Flow
The funnel is a **modal** that opens from the landing page. Loan purpose is pre-selected from the trigger button so **step 1 (Loan Purpose) is skipped**.

| Step | Question | UI | Auto-advance? |
|---|---|---|---|
| 1 | Property Type | 2×2 icon cards | Yes |
| 2 | Residency Type | Vertical list cards | Yes |
| 3 | Decision Timeline | Vertical list cards with chevron | Yes |
| 4 | ZIP Code | Single text input (state removed) | Next button |
| 5 | Property Value + Down Payment | Sliders + editable text inputs | Next button |
| 6 | Credit Score | Slider with color-coded bands | Next button |
| 7 | Military Service | 2 large list cards | Yes |
| — | Lead Capture | Name + Email + Phone form | Submit button |
| — | Loading Screen | 3-step staggered checklist | Auto (~2.3s) |
| — | Rates Display | 2 rate cards + collapsible loan summary | — |

---

## Architecture Decisions

### Modal vs Full-Screen
- **Decision:** Changed from full-screen SPA to a **modal overlay** on a landing page.
- **Reason:** Client wants to embed on existing website; two trigger buttons ("I'm Purchasing" / "I'm Refinancing") pre-select loan purpose and open the modal.
- Modal key prop forces full remount when loan purpose changes (clean state).

### Loan Purpose Pre-selection
- Landing page has two buttons: "I'm Purchasing" and "I'm Refinancing".
- Clicking a button sets `loanPurpose` in state and skips straight to Step 1 (Property Type).
- `useFunnel(initialPurpose)` accepts the purpose at mount time.
- Two separate step order arrays: `STEP_ORDER_WITH_PURPOSE` (7 question steps) and `STEP_ORDER` (8 with loan purpose).

### State Dropdown Removed (Step 4)
- **Decision:** Removed state dropdown from the Location step.
- **Reason:** Adds friction; ZIP alone is sufficient to infer state. Rate calculation doesn't vary by state.
- Only ZIP code input remains.

### TypeScript — verbatimModuleSyntax
- All type-only imports MUST use `import type { ... }`. Regular imports for runtime values (constants, functions).

### Rate Calculation (rateCalculator.ts)
Mock engine — no real API:
- 30-yr base: 6.75%, 15-yr base: 6.10%
- Adjustments: credit ≥ 740 → -0.25%, credit < 620 → +0.75%
- LTV > 80% → +0.25% (PMI note shown)
- Military → -0.125% (VA note shown)
- Rental property → +0.50%

### PDF Generation
- jsPDF, no html2canvas dependency in practice
- Navy header bar + logo, client info, loan details, two rate cards
- Filename: `texas-united-rates-[date].pdf`

---

## File Structure
```
src/
├── types/funnel.ts              — FunnelData, FunnelStep, STEP_ORDER variants
├── hooks/useFunnel.ts           — Step state, navigation, accepts initialPurpose
├── utils/
│   ├── rateCalculator.ts        — Mock rate engine + getCreditScoreLabel/getLTVStatus
│   └── pdfGenerator.ts          — jsPDF rate sheet builder
├── components/
│   ├── ui/
│   │   ├── ChoiceCard.tsx       — (legacy, mostly replaced by inline card code in steps)
│   │   ├── SliderInput.tsx      — Custom range slider with floating bubble
│   │   ├── ProgressBar.tsx      — (legacy, replaced by inline progress in FunnelLayout)
│   │   └── TrustBar.tsx         — (legacy, replaced by inline trust bar in FunnelLayout)
│   └── funnel/
│       ├── FunnelLayout.tsx     — Modal shell, backdrop, header, progress, trust footer
│       ├── steps/
│       │   ├── StepPropertyType.tsx
│       │   ├── StepResidencyType.tsx
│       │   ├── StepTimeline.tsx
│       │   ├── StepLocation.tsx     — ZIP only (state removed)
│       │   ├── StepFinancials.tsx   — Sliders + editable inputs, no LTV badge
│       │   ├── StepCreditScore.tsx
│       │   └── StepMilitary.tsx
│       ├── LeadCapture.tsx
│       ├── LoadingScreen.tsx
│       └── RatesDisplay.tsx
├── App.tsx                      — Landing page + FunnelModal component
└── index.css                    — Tailwind directives + slider CSS + Google Fonts (Inter)
```

---

## Deployment
- **Vercel** (connected to GitHub — auto-deploys on push to `main`)
- To redeploy manually: `~/.local/bin/vercel --yes --prod --scope jcsreenivasans-projects`

---

## Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-09-02 | Full-screen SPA built | Initial v1 |
| 2026-09-02 | Converted to modal | Client wants to embed on website |
| 2026-09-02 | Removed state dropdown | ZIP alone sufficient; reduces friction |
| 2026-09-02 | Loan purpose pre-selected from CTA buttons | Better UX — no redundant question |
| 2026-09-03 | Modal size increased | Felt cramped on previous size |
| 2026-09-03 | LTV badge removed from Financials step | Too technical for early funnel step |
| 2026-09-03 | Added editable inputs to Financials | Users want to type exact values |
| 2026-09-03 | Step-specific accent colors introduced | "Too dull" feedback — add visual variety |

---

## Known Items / Future Work
- No real backend; rate calculation is mocked. v2 should hit a live pricing API.
- Lead data currently stays in React state only. v2 should POST to a CRM (HubSpot, Salesforce, or custom).
- Phone formatting is US-only masked input.
- PDF branding uses text logo; v2 should use actual Texas United SVG/PNG logo.
- `html2canvas` is installed but unused — can be removed if PDF approach stays jsPDF-only.
- The `ChoiceCard`, `ProgressBar`, and `TrustBar` UI components in `src/components/ui/` are legacy — their logic was inlined into step files and FunnelLayout. They can be removed in a cleanup pass.
