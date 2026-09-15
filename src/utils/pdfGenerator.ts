import jsPDF from 'jspdf';
import type { FunnelData, RateData } from '../types/funnel';
import { creditBandLabel } from './rateCalculator';

function fmt(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function fmtDate(): string {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function humanize(val: string): string {
  return val.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

export function generateRatePDF(data: FunnelData, rates: RateData[]): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // Navy header bar
  doc.setFillColor(35, 59, 134);
  doc.rect(0, 0, pageW, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Texas United Mortgage', 15, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Personalized HELOC Estimate', 15, 28);

  doc.setFontSize(9);
  doc.text(`Generated: ${fmtDate()}`, pageW - 15, 28, { align: 'right' });

  // Red accent line
  doc.setFillColor(234, 37, 35);
  doc.rect(0, 40, pageW, 3, 'F');

  let y = 55;

  // Client info
  doc.setTextColor(35, 59, 134);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information', 15, y);
  y += 8;

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(15, y, pageW - 15, y);
  y += 6;

  doc.setFontSize(10);
  const clientRows: [string, string][] = [
    ['Name', data.lead.name || 'N/A'],
    ['Email', data.lead.email || 'N/A'],
    ['Phone', data.lead.phone || 'N/A'],
    ['Property Type', data.propertyType ? humanize(data.propertyType) : 'N/A'],
    ['Employment', data.employmentStatus ? humanize(data.employmentStatus) : 'N/A'],
  ];

  clientRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(label + ':', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(value, 70, y);
    y += 7;
  });

  y += 5;

  // HELOC profile
  doc.setTextColor(35, 59, 134);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('HELOC Profile', 15, y);
  y += 8;

  doc.setDrawColor(229, 231, 235);
  doc.line(15, y, pageW - 15, y);
  y += 6;

  const homeVal = data.homeValue ?? 0;
  const mortgageAmt = data.mortgageBalance ?? 0;
  const equity = homeVal - mortgageAmt;
  const maxLine = Math.max(0, homeVal * 0.85 - mortgageAmt);

  const helocRows: [string, string][] = [
    ['Est. Home Value', fmt(homeVal)],
    ['Mortgage Balance', mortgageAmt === 0 ? 'None / Paid Off' : fmt(mortgageAmt)],
    ['Est. Equity', fmt(equity)],
    ['Max Credit Line (85% CLTV)', fmt(maxLine)],
    ['Amount Requested', data.borrowAmount ? fmt(data.borrowAmount) : 'N/A'],
    ['Credit Profile', data.creditBand ? creditBandLabel(data.creditBand) : 'N/A'],
    ['Use of Funds', data.useOfFunds ? humanize(data.useOfFunds) : 'N/A'],
    ['Property ZIP', data.zipCode ?? 'N/A'],
  ];

  doc.setFontSize(10);
  helocRows.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(label + ':', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(value, 90, y);
    y += 7;
  });

  y += 8;

  // Rate cards
  doc.setTextColor(35, 59, 134);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Personalized HELOC Options', 15, y);
  y += 8;

  doc.setDrawColor(229, 231, 235);
  doc.line(15, y, pageW - 15, y);
  y += 8;

  rates.forEach((rate, idx) => {
    doc.setFillColor(idx === 0 ? 238 : 248, idx === 0 ? 242 : 250, idx === 0 ? 255 : 252);
    doc.roundedRect(15, y - 4, pageW - 30, 62, 3, 3, 'F');
    doc.setDrawColor(idx === 0 ? 35 : 229, idx === 0 ? 59 : 231, idx === 0 ? 134 : 235);
    doc.setLineWidth(idx === 0 ? 0.8 : 0.3);
    doc.roundedRect(15, y - 4, pageW - 30, 62, 3, 3, 'S');

    doc.setTextColor(35, 59, 134);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(rate.label, 22, y + 6);

    const rateType = rate.isVariableRate ? 'Variable Rate' : 'Fixed Rate';
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(rateType, 22, y + 13);

    if (rate.badge) {
      doc.setFillColor(234, 37, 35);
      doc.roundedRect(pageW - 58, y - 1, 41, 9, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(rate.badge, pageW - 37.5, y + 5.5, { align: 'center' });
    }

    const fields: [string, string][] = [
      ['Interest Rate', `${rate.interestRate.toFixed(2)}%${rate.isVariableRate ? ' (variable)' : ' (fixed)'}`],
      ['APR', `${rate.apr.toFixed(2)}%`],
      ['Est. Monthly', fmt(rate.monthlyPayment) + (rate.isVariableRate ? ' (interest-only)' : '/mo')],
      ['Loan Amount', fmt(rate.loanAmount)],
    ];

    const colW = (pageW - 30) / 2;
    fields.forEach((field, fi) => {
      const col = fi % 2;
      const row = Math.floor(fi / 2);
      const fx = 22 + col * colW;
      const fy = y + 22 + row * 14;

      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(field[0], fx, fy);
      doc.setTextColor(17, 24, 39);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(field[1], fx, fy + 7);
    });

    const periodLine = rate.drawPeriod
      ? `Draw period: ${rate.drawPeriod}  ·  Repayment: ${rate.repaymentPeriod}`
      : `Term: ${rate.repaymentPeriod}`;
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(periodLine, 22, y + 54);

    y += 70;
  });

  y += 5;

  // Disclaimer
  doc.setFillColor(249, 250, 251);
  doc.rect(0, y, pageW, 44, 'F');

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');

  const disclaimer = [
    'Disclaimer: HELOC estimates are based on information provided and current market conditions.',
    'Actual rates and credit lines may vary based on full underwriting, appraisal, and credit verification.',
    'This is not a commitment to lend. Texas United Mortgage Company — NMLS #46749.',
    `Texas United Mortgage  ·  texasunitedmortgage.com  ·  (800) 555-LOAN  ·  ${fmtDate()}`,
  ];

  disclaimer.forEach((line, i) => {
    doc.text(line, pageW / 2, y + 8 + i * 6, { align: 'center' });
  });

  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`texas-united-heloc-${dateStr}.pdf`);
}
