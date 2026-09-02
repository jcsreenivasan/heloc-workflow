import jsPDF from 'jspdf';
import type { FunnelData, RateData } from '../types/funnel';

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function formatDate(): string {
  return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function generateRatePDF(data: FunnelData, rates: RateData[]): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageW = doc.internal.pageSize.getWidth();

  // Navy header bar
  doc.setFillColor(35, 59, 134);
  doc.rect(0, 0, pageW, 40, 'F');

  // Logo text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Texas United Mortgage', 15, 18);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Personalized Rate Sheet', 15, 28);

  // Date
  doc.setFontSize(9);
  doc.text(`Generated: ${formatDate()}`, pageW - 15, 28, { align: 'right' });

  // Red accent line
  doc.setFillColor(234, 37, 35);
  doc.rect(0, 40, pageW, 3, 'F');

  let y = 55;

  // Client info section
  doc.setTextColor(35, 59, 134);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Client Information', 15, y);
  y += 8;

  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(15, y, pageW - 15, y);
  y += 6;

  doc.setTextColor(75, 85, 99);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const clientInfo = [
    ['Name', data.lead.name || 'N/A'],
    ['Email', data.lead.email || 'N/A'],
    ['Phone', data.lead.phone || 'N/A'],
    ['Loan Purpose', data.loanPurpose ? (data.loanPurpose.charAt(0).toUpperCase() + data.loanPurpose.slice(1)) : 'N/A'],
    ['Property Type', data.propertyType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || 'N/A'],
    ['Location', data.state ? `${data.state} ${data.zip}` : 'N/A'],
  ];

  clientInfo.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(label + ':', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(value, 65, y);
    y += 7;
  });

  y += 5;

  // Loan details section
  doc.setTextColor(35, 59, 134);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Loan Details', 15, y);
  y += 8;

  doc.setDrawColor(229, 231, 235);
  doc.line(15, y, pageW - 15, y);
  y += 6;

  const loanDetails = [
    ['Property Value', formatCurrency(data.propertyValue)],
    ['Down Payment', formatCurrency(data.downPayment)],
    ['Loan Amount', formatCurrency(data.propertyValue - data.downPayment)],
    ['LTV Ratio', `${((data.propertyValue - data.downPayment) / data.propertyValue * 100).toFixed(1)}%`],
    ['Credit Score', data.creditScore.toString()],
    ['Military Service', data.military ? 'Yes (VA Eligible)' : 'No'],
  ];

  doc.setFontSize(10);
  loanDetails.forEach(([label, value]) => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(55, 65, 81);
    doc.text(label + ':', 15, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text(value, 65, y);
    y += 7;
  });

  y += 8;

  // Rate cards section
  doc.setTextColor(35, 59, 134);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Your Personalized Rates', 15, y);
  y += 8;

  doc.setDrawColor(229, 231, 235);
  doc.line(15, y, pageW - 15, y);
  y += 8;

  rates.forEach((rate, idx) => {
    // Card background
    doc.setFillColor(idx === 0 ? 238 : 248, idx === 0 ? 242 : 250, idx === 0 ? 255 : 252);
    doc.roundedRect(15, y - 4, pageW - 30, 58, 3, 3, 'F');

    // Card border
    doc.setDrawColor(idx === 0 ? 35 : 229, idx === 0 ? 59 : 231, idx === 0 ? 134 : 235);
    doc.setLineWidth(idx === 0 ? 0.8 : 0.3);
    doc.roundedRect(15, y - 4, pageW - 30, 58, 3, 3, 'S');

    // Term title
    doc.setTextColor(35, 59, 134);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(rate.term, 22, y + 6);

    if (rate.badge) {
      doc.setFillColor(234, 37, 35);
      doc.roundedRect(pageW - 55, y - 1, 38, 9, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(rate.badge, pageW - 36, y + 5.5, { align: 'center' });
    }

    // Rate details in a table-like layout
    const rateFields = [
      ['Interest Rate', `${rate.interestRate.toFixed(3)}%`],
      ['APR', `${rate.apr.toFixed(3)}%`],
      ['Monthly Payment', formatCurrency(rate.monthlyPayment)],
      ['Loan Amount', formatCurrency(rate.loanAmount)],
    ];

    const colW = (pageW - 30) / 2;
    rateFields.forEach((field, fi) => {
      const col = fi % 2;
      const row = Math.floor(fi / 2);
      const fx = 22 + col * colW;
      const fy = y + 18 + row * 14;

      doc.setTextColor(107, 114, 128);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text(field[0], fx, fy);

      doc.setTextColor(17, 24, 39);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(field[1], fx, fy + 7);
    });

    if (rate.isPMI) {
      doc.setTextColor(234, 88, 12);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('* PMI may apply (LTV > 80%)', 22, y + 50);
    }
    if (rate.isVA) {
      doc.setTextColor(22, 163, 74);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.text('* VA loan benefits applied', 22, y + 50);
    }

    y += 66;
  });

  y += 5;

  // Disclaimer footer
  doc.setFillColor(249, 250, 251);
  doc.rect(0, y, pageW, 40, 'F');

  doc.setTextColor(107, 114, 128);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');

  const disclaimer = [
    'Disclaimer: Rates shown are estimates based on information provided and current market conditions.',
    'Actual rates may vary. This is not a loan commitment or guarantee. Contact a licensed loan officer',
    'for exact quotes and official Loan Estimate. Texas United Mortgage Company — NMLS #46749.',
    `Texas United Mortgage | texasunitedmortgage.com | (800) 555-LOAN | ${formatDate()}`,
  ];

  disclaimer.forEach((line, i) => {
    doc.text(line, pageW / 2, y + 8 + i * 6, { align: 'center' });
  });

  // Generate filename with date
  const dateStr = new Date().toISOString().split('T')[0];
  doc.save(`texas-united-rates-${dateStr}.pdf`);
}
