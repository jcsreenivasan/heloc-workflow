# Texas United Mortgage — HELOC Funnel Context

## Project Overview
High-conversion HELOC (Home Equity Line of Credit) lead funnel for Texas United's website. Collects 8 answers across 3 multi-question steps with progressive reveal within each step. Non-homeowners are disqualified immediately. Results gated behind lead-capture form, then reveals personalized HELOC rate cards with PDF download. Frontend-only (v1 — no backend; form data stays in React state).

**Preview URL (Client Share):** https://heloc-workflow-7qeeqgt1g-jcsreenivasans-projects.vercel.app
**GitHub (active working repo):** https://github.com/jcsreenivasan/heloc-workflow
**GitHub (original source — mortgage funnel):** https://github.com/jcsreenivasan/Texasunited-funnel
**Vercel Team:** jcsreenivasans-projects
**Vercel Project:** heloc-workflow

---

## Tech Stack
| Tool | Version | Purpose |
|---|---|---|
| React 19 + Vite | Latest | SPA |
| TypeScript | ~6.0 | Type safety (`verbatimModuleSyntax` ON — always use `import type`) |
| Tailwind CSS | v3 | Styling |
| Framer Motion | Latest | Animations, modal, step transitions, progressive reveal |
| Lucide React | Latest | Icons |
| jsPDF | Latest | PDF HELOC estimate generation |

---

## Brand Colors
- **Primary red:** `#EA2523` — CTAs, selections, accents, current step progress
- **Primary navy:** `#233B86` — headers, secondary buttons, trust elements, completed steps

---

## Funnel Flow
The funnel is a **modal** opened from the landing page via a single "Check My HELOC Rate" CTA. It has 3 multi-question steps with progressive reveal — new questions appear within the same step page as previous answers are given.

### Step 1 — Your Property
| # | Question | UI | Reveals when |
|---|---|---|---|
| Q1 | Do you currently own your home? | 2 large cards (Yes/No) | Always shown |
| Q2 | What type of property is it? | 2×2 icon cards | Q1 = Yes |
| Q3 | What's the estimated current value? | Radio-style range list | Q2 answered |
- If Q1 = **No** → immediately navigates to `DisqualifiedScreen`
- "Continue" button appears when all 3 are answered

### Step 2 — Financial Profile
| # | Question | UI | Reveals when |
|---|---|---|---|
| Q4 | What's your remaining mortgage balance? | Radio-style range list | Always shown |
| Q5 | What's your estimated credit score? | 2×2 band cards (color-coded) | Q4 answered |
| Q6 | What do you plan to use the funds for? | 2-column icon cards (5 options) | Q5 answered |
- "Continue" button appears when all 3 are answered

### Step 3 — Loan Details
| # | Question | UI | Reveals when |
|---|---|---|---|
| Q7 | How much are you looking to borrow? | Radio-style range list | Always shown |
| Q8 | What's your employment status? | 2×2 icon cards | Q7 answered |
- "See My HELOC Options" button appears when both answered

### Then
| Screen | Trigger |
|---|---|
| Lead Capture | After Step 3 → Continue |
| Loading Screen | After lead form submit |
| Rates Display | Auto (~2.8s) |

---

## Question Options

### Q3 — Home Value Ranges
`<200k` · `200k-400k` · `400k-600k` · `600k-1m` · `1m+`

### Q4 — Mortgage Balance Ranges
`none` · `<50k` · `50k-100k` · `100k-200k` · `200k-300k` · `300k+`

### Q5 — Credit Bands
`excellent` (720+) · `good` (660–719) · `fair` (600–659) · `poor` (<600)

### Q6 — Use of Funds
`home-improvement` · `debt-consolidation` · `major-purchase` · `emergency-fund` · `other`

### Q7 — Borrow Amount Ranges
`<25k` · `25k-50k` · `50k-100k` · `100k-150k` · `150k+`

### Q8 — Employment Status
`employed` · `self-employed` · `retired` · `other`

---

## Architecture Decisions

### 3-Step Multi-Question Model
- **Decision:** Each "step" is one page with 2–3 questions that progressively reveal as previous answers are given (Framer Motion AnimatePresence).
- **Reason:** Reduces total page transitions (3 instead of 8). Within-step reveals feel lighter and faster than full step transitions.
- Progress bar shows "Step X of 3" with 3 segments.

### Disqualification on Non-Homeowner
- If Q1 = "No", `disqualify()` is called after a 200ms delay (allows the selection animation to play).
- Navigates to `DisqualifiedScreen` which shows call-to-action and close button.
- `canGoBack` returns false on `disqualified` step — no navigation away.

### HELOC Rate Calculation (rateCalculator.ts)
Mock engine — no real API:
- **Prime Rate:** 8.50% (current)
- **HELOC (variable):** Prime + spread based on credit band
  - Excellent → +0.25% = 8.75%
  - Good → +0.75% = 9.25%
  - Fair → +1.50% = 10.00%
  - Poor → +2.75% = 11.25%
- **Home Equity Loan (fixed, 10-yr term):**
  - Excellent: 8.99%  ·  Good: 9.49%  ·  Fair: 10.24%  ·  Poor: 11.49%
- **Max credit line:** homeValue × 0.85 − mortgageBalance (85% CLTV rule)
- **Loan amount shown:** min(requested amount, max credit line)
- HELOC monthly payment = interest-only during draw period
- HEL monthly payment = fully amortized over 10 years

### TypeScript — verbatimModuleSyntax
- All type-only imports MUST use `import type { ... }`. Regular imports for runtime values.
- Framer Motion `ease` properties must use `as const` to satisfy strict `Easing` type.

---

## File Structure
```
src/
├── types/funnel.ts              — FunnelData, FunnelStep, STEP_ORDER, QUESTION_STEPS
│                                  TypeAliases: HomeValue, MortgageBalance, CreditBand,
│                                  UseOfFunds, BorrowAmount, EmploymentStatus, PropertyType
├── hooks/useFunnel.ts           — Step state, navigation, disqualify(), goBack/goNext
├── utils/
│   ├── rateCalculator.ts        — HELOC rate engine, midpoint helpers, creditBandLabel
│   └── pdfGenerator.ts         — jsPDF HELOC estimate builder
├── components/
│   └── funnel/
│       ├── FunnelLayout.tsx     — Modal shell, progress bar (3 steps), trust footer
│       ├── DisqualifiedScreen.tsx — Non-homeowner screen with call CTA
│       ├── LeadCapture.tsx      — Name + Email + Phone form with validation
│       ├── LoadingScreen.tsx    — Auto-advance, HELOC-specific checklist text
│       ├── RatesDisplay.tsx     — HELOC + HEL rate cards, equity summary, PDF download
│       └── steps/
│           ├── StepOne.tsx      — Q1 (own home?) + Q2 (property type) + Q3 (value)
│           ├── StepTwo.tsx      — Q4 (balance) + Q5 (credit score) + Q6 (use)
│           └── StepThree.tsx    — Q7 (borrow amount) + Q8 (employment)
├── App.tsx                      — HELOC landing page + FunnelModal (single CTA)
└── index.css                    — Tailwind directives + Google Fonts (Inter)
```

---

## Deployment
- **Vercel** (connected to GitHub — auto-deploys on push to `main`)
- **Active repo:** https://github.com/jcsreenivasan/heloc-workflow
- **Vercel project name:** `heloc-workflow` (renamed from `texasunited-funnel`)
- Preview deploy: `~/.local/bin/vercel --yes --scope jcsreenivasans-projects`
- Production deploy: `~/.local/bin/vercel --yes --prod --scope jcsreenivasans-projects`

---

## Decisions Log

| Date | Decision | Reason |
|---|---|---|
| 2026-09-02 | Full-screen SPA built (mortgage) | Initial v1 |
| 2026-09-02 | Converted to modal | Client wants to embed on website |
| 2026-09-02 | Removed state dropdown | ZIP alone sufficient; reduces friction |
| 2026-09-02 | Loan purpose pre-selected from CTA buttons | Better UX — no redundant question |
| 2026-09-03 | Modal size increased | Felt cramped on previous size |
| 2026-09-03 | LTV badge removed from Financials step | Too technical for early funnel step |
| 2026-09-03 | Added editable inputs to Financials | Users want to type exact values |
| 2026-09-03 | Step-specific accent colors introduced | "Too dull" feedback — add visual variety |
| 2026-09-11 | Cloned to new repo `heloc-workflow` | Separate working repo for client iteration |
| 2026-09-11 | Rebuilt as HELOC-specific 3-step funnel | Client requirement: HELOC flow with 8 questions in 3 steps |
| 2026-09-11 | Multi-question steps with progressive reveal | Reduces page transitions; faster feel |
| 2026-09-11 | Added disqualification for non-homeowners | HELOCs require homeownership — eliminates bad leads |
| 2026-09-11 | Renamed Vercel project to `heloc-workflow` | Cleaner preview URL for client sharing |
| 2026-09-11 | HELOC rate model: Prime + spread + HEL fixed | Matches real HELOC product structure |

---

## Known Items / Future Work
- No real backend; rate calculation is mocked. v2 should hit a live pricing API.
- Lead data stays in React state only. v2 should POST to a CRM (HubSpot, Salesforce, or custom).
- HELOC rates are variable (Prime + spread); Prime Rate should be fetched live in v2.
- Phone formatting is US-only masked input.
- PDF branding uses text logo; v2 should use actual Texas United SVG/PNG logo.
- `html2canvas` is installed but unused — can be removed.
- The `ChoiceCard`, `ProgressBar`, `TrustBar`, and `SliderInput` UI components in `src/components/ui/` are legacy from the mortgage funnel — unused in HELOC funnel and can be deleted in a cleanup pass.
- Vercel project is now `heloc-workflow` — old `texasunited-funnel` Vercel project still exists but is no longer used for this repo.
