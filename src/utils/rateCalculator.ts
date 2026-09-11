import type { FunnelData, RateData, HomeValue, MortgageBalance, BorrowAmount, CreditBand } from '../types/funnel';

const PRIME_RATE = 8.5;

export function homeValueMidpoint(val: HomeValue): number {
  const map: Record<HomeValue, number> = {
    '<200k': 150000,
    '200k-400k': 300000,
    '400k-600k': 500000,
    '600k-1m': 800000,
    '1m+': 1250000,
  };
  return map[val];
}

export function mortgageBalanceMidpoint(val: MortgageBalance): number {
  const map: Record<MortgageBalance, number> = {
    'none': 0,
    '<50k': 35000,
    '50k-100k': 75000,
    '100k-200k': 150000,
    '200k-300k': 250000,
    '300k+': 350000,
  };
  return map[val];
}

export function borrowAmountMidpoint(val: BorrowAmount): number {
  const map: Record<BorrowAmount, number> = {
    '<25k': 20000,
    '25k-50k': 37500,
    '50k-100k': 75000,
    '100k-150k': 125000,
    '150k+': 175000,
  };
  return map[val];
}

function helocSpread(creditBand: CreditBand): number {
  const map: Record<CreditBand, number> = {
    excellent: 0.25,
    good: 0.75,
    fair: 1.5,
    poor: 2.75,
  };
  return map[creditBand];
}

function homeEquityLoanRate(creditBand: CreditBand): number {
  const map: Record<CreditBand, number> = {
    excellent: 8.99,
    good: 9.49,
    fair: 10.24,
    poor: 11.49,
  };
  return map[creditBand];
}

function calcMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const r = annualRate / 100 / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export interface RateCalculationResult {
  rates: RateData[];
  equity: number;
  maxLineAmount: number;
  homeVal: number;
  mortgageAmt: number;
  requestedAmt: number;
}

export function calculateRates(data: FunnelData): RateCalculationResult {
  const homeVal = homeValueMidpoint(data.homeValue!);
  const mortgageAmt = mortgageBalanceMidpoint(data.mortgageBalance!);
  const requestedAmt = borrowAmountMidpoint(data.borrowAmount!);
  const creditBand = data.creditBand!;

  const equity = homeVal - mortgageAmt;
  const maxCLTV = homeVal * 0.85;
  const maxLineAmount = Math.max(0, maxCLTV - mortgageAmt);
  const loanAmount = Math.min(requestedAmt, maxLineAmount);

  const helocRate = PRIME_RATE + helocSpread(creditBand);
  const helRate = homeEquityLoanRate(creditBand);

  // HELOC: interest-only during draw period
  const helocMonthly = (loanAmount * (helocRate / 100)) / 12;
  // Home Equity Loan: fully amortized over 10 years
  const helMonthly = calcMonthlyPayment(loanAmount, helRate, 10);

  return {
    equity,
    maxLineAmount,
    homeVal,
    mortgageAmt,
    requestedAmt,
    rates: [
      {
        type: 'heloc',
        label: 'HELOC',
        badge: 'Most Flexible',
        interestRate: helocRate,
        apr: helocRate + 0.05,
        monthlyPayment: helocMonthly,
        loanAmount,
        drawPeriod: '10 years',
        repaymentPeriod: '20 years',
        isVariableRate: true,
      },
      {
        type: 'home-equity-loan',
        label: 'Home Equity Loan',
        badge: 'Fixed Rate',
        interestRate: helRate,
        apr: helRate + 0.12,
        monthlyPayment: helMonthly,
        loanAmount,
        repaymentPeriod: '10 years',
        isVariableRate: false,
      },
    ],
  };
}

export function creditBandLabel(band: CreditBand): string {
  const map: Record<CreditBand, string> = {
    excellent: 'Excellent (720+)',
    good: 'Good (660–719)',
    fair: 'Fair (600–659)',
    poor: 'Poor (below 600)',
  };
  return map[band];
}
