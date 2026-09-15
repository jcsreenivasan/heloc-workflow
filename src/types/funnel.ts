export type CreditBand = 'excellent' | 'good' | 'fair' | 'poor';
export type UseOfFunds =
  | 'home-improvement'
  | 'debt-consolidation'
  | 'major-purchase'
  | 'emergency-fund'
  | 'other';
export type EmploymentStatus = 'employed' | 'self-employed' | 'retired' | 'other';
export type PropertyType = 'single-family' | 'condo' | 'townhome' | 'multi-unit';

export interface FunnelData {
  ownsHome: boolean | null;
  propertyType: PropertyType | null;
  homeValue: number | null;       // slider: $50k–$2M
  mortgageBalance: number | null; // slider: $0–$700k
  creditBand: CreditBand | null;
  useOfFunds: UseOfFunds | null;
  borrowAmount: number | null;    // slider: $10k–$350k
  employmentStatus: EmploymentStatus | null;
  zipCode: string | null;
  lead: {
    name: string;
    email: string;
    phone: string;
  };
}

export interface RateData {
  type: 'heloc' | 'home-equity-loan';
  label: string;
  badge?: string;
  interestRate: number;
  apr: number;
  monthlyPayment: number;
  loanAmount: number;
  drawPeriod?: string;
  repaymentPeriod: string;
  isVariableRate: boolean;
}

export type FunnelStep =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'disqualified'
  | 'lead-capture'
  | 'loading'
  | 'rates';

export const STEP_ORDER: FunnelStep[] = [
  'step1',
  'step2',
  'step3',
  'step4',
  'lead-capture',
  'loading',
  'rates',
];

export const QUESTION_STEPS: FunnelStep[] = ['step1', 'step2', 'step3', 'step4'];
