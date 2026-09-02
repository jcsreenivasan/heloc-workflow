import type { FunnelData, RateData } from '../types/funnel';

function calculateMonthlyPayment(principal: number, annualRate: number, termYears: number): number {
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  if (monthlyRate === 0) return principal / numPayments;
  return (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1);
}

export function calculateRates(data: FunnelData): RateData[] {
  const loanAmount = data.propertyValue - data.downPayment;
  const ltv = (loanAmount / data.propertyValue) * 100;

  let adjustment30 = 0;
  let adjustment15 = 0;

  // Credit score adjustments
  if (data.creditScore >= 740) {
    adjustment30 -= 0.25;
    adjustment15 -= 0.25;
  } else if (data.creditScore < 620) {
    adjustment30 += 0.75;
    adjustment15 += 0.75;
  } else if (data.creditScore < 670) {
    adjustment30 += 0.375;
    adjustment15 += 0.375;
  }

  // LTV adjustment (PMI threshold)
  const isPMI = ltv > 80;
  if (isPMI) {
    adjustment30 += 0.25;
    adjustment15 += 0.25;
  }

  // VA benefit
  const isVA = data.military === true;
  if (isVA) {
    adjustment30 -= 0.125;
    adjustment15 -= 0.125;
  }

  // Rental property
  if (data.residencyType === 'rental') {
    adjustment30 += 0.5;
    adjustment15 += 0.5;
  }

  const base30 = 6.75 + adjustment30;
  const base15 = 6.10 + adjustment15;

  const apr30 = base30 + 0.12; // Typical APR spread
  const apr15 = base15 + 0.10;

  return [
    {
      term: '30-Year Fixed',
      interestRate: Math.max(base30, 3.0),
      apr: Math.max(apr30, 3.12),
      monthlyPayment: calculateMonthlyPayment(loanAmount, Math.max(base30, 3.0), 30),
      loanAmount,
      label: '30-Year Fixed',
      badge: 'Most Popular',
      isPMI,
      isVA,
    },
    {
      term: '15-Year Fixed',
      interestRate: Math.max(base15, 2.5),
      apr: Math.max(apr15, 2.6),
      monthlyPayment: calculateMonthlyPayment(loanAmount, Math.max(base15, 2.5), 15),
      loanAmount,
      label: '15-Year Fixed',
      badge: 'Best Value',
      isPMI,
      isVA,
    },
  ];
}

export function getCreditScoreLabel(score: number): { label: string; color: string } {
  if (score >= 740) return { label: 'Excellent', color: '#16a34a' };
  if (score >= 670) return { label: 'Good', color: '#ca8a04' };
  if (score >= 580) return { label: 'Fair', color: '#ea580c' };
  return { label: 'Poor', color: '#dc2626' };
}

export function getLTVStatus(ltv: number): { label: string; color: string } {
  if (ltv <= 80) return { label: 'No PMI', color: '#16a34a' };
  if (ltv <= 90) return { label: 'PMI Required', color: '#ea580c' };
  return { label: 'High LTV', color: '#dc2626' };
}
