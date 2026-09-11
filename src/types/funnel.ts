export type HomeValue = '<200k' | '200k-400k' | '400k-600k' | '600k-1m' | '1m+';
export type MortgageBalance = 'none' | '<50k' | '50k-100k' | '100k-200k' | '200k-300k' | '300k+';
export type CreditBand = 'excellent' | 'good' | 'fair' | 'poor';
export type UseOfFunds =
  | 'home-improvement'
  | 'debt-consolidation'
  | 'major-purchase'
  | 'emergency-fund'
  | 'other';
export type BorrowAmount = '<25k' | '25k-50k' | '50k-100k' | '100k-150k' | '150k+';
export type EmploymentStatus = 'employed' | 'self-employed' | 'retired' | 'other';
export type PropertyType = 'single-family' | 'condo' | 'multi-family' | 'manufactured';

export interface FunnelData {
  ownsHome: boolean | null;
  propertyType: PropertyType | null;
  homeValue: HomeValue | null;
  mortgageBalance: MortgageBalance | null;
  creditBand: CreditBand | null;
  useOfFunds: UseOfFunds | null;
  borrowAmount: BorrowAmount | null;
  employmentStatus: EmploymentStatus | null;
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
  | 'disqualified'
  | 'lead-capture'
  | 'loading'
  | 'rates';

export const STEP_ORDER: FunnelStep[] = [
  'step1',
  'step2',
  'step3',
  'lead-capture',
  'loading',
  'rates',
];

export const QUESTION_STEPS: FunnelStep[] = ['step1', 'step2', 'step3'];
