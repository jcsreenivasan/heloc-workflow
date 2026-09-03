export interface FunnelData {
  loanPurpose: 'purchase' | 'refinance' | null;
  propertyType: 'single-family' | 'townhome' | 'condo' | 'multi-unit' | null;
  residencyType: 'primary' | 'second-home' | 'rental' | null;
  timeline: 'now' | '30-days' | '2-4-months' | 'researching' | null;
  state: string;
  zip: string;
  propertyValue: number;
  downPayment: number;
  creditScore: number;
  military: boolean | null;
  lead: {
    name: string;
    email: string;
    phone: string;
  };
}

export type FunnelStep =
  | 'loan-purpose'
  | 'property-type'
  | 'residency-type'
  | 'timeline'
  | 'location'
  | 'financials'
  | 'credit-score'
  | 'military'
  | 'lead-capture'
  | 'loading'
  | 'rates';

// When loan purpose is pre-selected from the landing page, skip 'loan-purpose' step
export const STEP_ORDER_WITH_PURPOSE: FunnelStep[] = [
  'property-type',
  'residency-type',
  'timeline',
  'location',
  'financials',
  'credit-score',
  'military',
  'lead-capture',
  'loading',
  'rates',
];

export const STEP_ORDER: FunnelStep[] = [
  'loan-purpose',
  'property-type',
  'residency-type',
  'timeline',
  'location',
  'financials',
  'credit-score',
  'military',
  'lead-capture',
  'loading',
  'rates',
];

export const QUESTION_STEPS_WITH_PURPOSE: FunnelStep[] = [
  'property-type',
  'residency-type',
  'timeline',
  'location',
  'financials',
  'credit-score',
  'military',
];

export const QUESTION_STEPS: FunnelStep[] = [
  'loan-purpose',
  'property-type',
  'residency-type',
  'timeline',
  'location',
  'financials',
  'credit-score',
  'military',
];

export interface RateData {
  term: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  loanAmount: number;
  label: string;
  badge?: string;
  isPMI?: boolean;
  isVA?: boolean;
}
