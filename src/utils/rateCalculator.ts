import type { FunnelData, RateData } from '../types/funnel';

const PRIME_RATE = 8.5;

type CreditBand = 'excellent' | 'good' | 'fair' | 'poor';

function scoreToBand(score: number): CreditBand {
  if (score >= 740) return 'excellent';
  if (score >= 670) return 'good';
  if (score >= 580) return 'fair';
  return 'poor';
}

function helocSpread(band: CreditBand): number {
  const map: Record<CreditBand, number> = {
    excellent: 0.25,
    good: 0.75,
    fair: 1.5,
    poor: 2.75,
  };
  return map[band];
}

function homeEquityLoanRate(band: CreditBand): number {
  const map: Record<CreditBand, number> = {
    excellent: 8.99,
    good: 9.49,
    fair: 10.24,
    poor: 11.49,
  };
  return map[band];
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
  const homeVal = data.homeValue ?? 400000;
  const mortgageAmt = data.mortgageBalance ?? 0;
  const requestedAmt = data.borrowAmount ?? 75000;
  const band = scoreToBand(data.creditScore ?? 700);

  const equity = homeVal - mortgageAmt;
  const maxCLTV = homeVal * 0.85;
  const maxLineAmount = Math.max(0, maxCLTV - mortgageAmt);
  const loanAmount = Math.min(requestedAmt, maxLineAmount);

  const helocRate = PRIME_RATE + helocSpread(band);
  const helRate = homeEquityLoanRate(band);

  // HELOC: interest-only draw period
  const helocMonthly = (loanAmount * (helocRate / 100)) / 12;
  // Home Equity Loan: fully amortized 10 years
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

export function creditScoreLabel(score: number): string {
  const band = scoreToBand(score);
  const labels: Record<CreditBand, string> = {
    excellent: `Excellent (${score})`,
    good: `Good (${score})`,
    fair: `Fair (${score})`,
    poor: `Poor (${score})`,
  };
  return labels[band];
}
