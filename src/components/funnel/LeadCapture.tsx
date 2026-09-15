import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { FunnelData } from '../../types/funnel';

interface LeadCaptureProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onSubmit: () => void;
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function humanize(val: string) {
  return val.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function getBandLabel(score: number) {
  if (score >= 740) return 'Excellent';
  if (score >= 670) return 'Good';
  if (score >= 580) return 'Fair';
  return 'Poor';
}

// Fake blurred rate rows to tease the results
const FAKE_ROWS = [
  { product: 'HELOC · 10yr Draw / 20yr Repay', rate: '8.75%', apr: '8.80%', payment: '$588/mo' },
  { product: 'Home Equity Loan · 10yr Fixed',  rate: '9.49%', apr: '9.61%', payment: '$777/mo' },
  { product: 'HELOC · 5yr Draw / 25yr Repay',  rate: '9.00%', apr: '9.05%', payment: '$605/mo' },
  { product: 'Home Equity Loan · 15yr Fixed',  rate: '9.75%', apr: '9.88%', payment: '$522/mo' },
  { product: 'HELOC · 10yr Draw / 20yr Repay', rate: '8.99%', apr: '9.04%', payment: '$601/mo' },
  { product: 'Home Equity Loan · 10yr Fixed',  rate: '9.25%', apr: '9.38%', payment: '$758/mo' },
  { product: 'HELOC · 7yr Draw / 23yr Repay',  rate: '8.85%', apr: '8.91%', payment: '$595/mo' },
  { product: 'Home Equity Loan · 20yr Fixed',  rate: '9.10%', apr: '9.22%', payment: '$498/mo' },
  { product: 'HELOC · 10yr Draw / 20yr Repay', rate: '9.15%', apr: '9.21%', payment: '$620/mo' },
  { product: 'Home Equity Loan · 30yr Fixed',  rate: '8.90%', apr: '9.03%', payment: '$445/mo' },
];

export function LeadCapture({ data, onChange, onSubmit }: LeadCaptureProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const email = data.lead.email;
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = () => {
    if (!isValidEmail) { setError('Please enter a valid email address.'); return; }
    setSubmitting(true);
    setTimeout(onSubmit, 600);
  };

  // Sidebar data rows
  const sidebarRows = [
    { label: 'Property Type',   value: data.propertyType ? humanize(data.propertyType) : '—' },
    { label: 'Home Value',      value: data.homeValue ? fmtCurrency(data.homeValue) : '—' },
    { label: 'Mortgage Bal.',   value: data.mortgageBalance === 0 ? 'None / Paid Off' : data.mortgageBalance ? fmtCurrency(data.mortgageBalance) : '—' },
    { label: 'Credit Score',    value: data.creditScore ? `${data.creditScore} (${getBandLabel(data.creditScore)})` : '—' },
    { label: 'Use of Funds',    value: data.useOfFunds ? humanize(data.useOfFunds) : '—' },
    { label: 'Borrow Amount',   value: data.borrowAmount ? fmtCurrency(data.borrowAmount) : '—' },
    { label: 'Employment',      value: data.employmentStatus ? humanize(data.employmentStatus) : '—' },
  ];

  return (
    <div
      className="flex flex-col sm:flex-row min-h-[700px]"
      style={{ background: 'linear-gradient(to right, #1A2B63 260px, white 260px)' }}
    >
      {/* ── Left sidebar — hidden on mobile ──────────── */}
      <div className="hidden sm:flex w-[260px] flex-shrink-0 px-6 py-7 flex-col">
        <p className="text-white font-bold text-base mb-5">Your selected details</p>
        <div className="space-y-0">
          {sidebarRows.map((row, i) => (
            <div
              key={row.label}
              className={`flex justify-between items-start py-3 ${
                i < sidebarRows.length - 1 ? 'border-b border-white/10' : ''
              }`}
            >
              <span className="text-white/50 text-xs leading-tight">{row.label}</span>
              <span className="text-white font-bold text-xs text-right ml-3 leading-tight">{row.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right content ──────────────────────────────── */}
      <div className="flex-1 flex flex-col px-6 py-6">

        {/* Live rates badge */}
        <div className="flex justify-center mb-4">
          <div className="inline-flex items-center gap-2 bg-[#EA2523] text-white text-xs font-bold px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE RATES
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-lg font-black text-gray-900 text-center mb-4 leading-snug">
          You have{' '}
          <span className="text-[#233B86]">2 HELOC offers</span>{' '}
          that are ready for your review!
        </h2>

        {/* Blurred table + overlay card */}
        <div className="relative flex-1">
          {/* Table header */}
          <div className="grid grid-cols-4 gap-2 mb-1.5 px-1">
            {['PRODUCT', 'RATE', 'APR', 'MO. PAYMENT'].map(h => (
              <p key={h} className="text-[10px] font-bold uppercase tracking-wide text-center" style={{ color: '#757575' }}>{h}</p>
            ))}
          </div>

          {/* Blurred rows */}
          <div className="select-none pointer-events-none" style={{ filter: 'blur(4px)' }}>
            {FAKE_ROWS.map((row, i) => (
              <div
                key={i}
                className={`grid grid-cols-4 gap-2 px-2 py-3 ${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} rounded`}
              >
                <p className="text-sm text-gray-700 font-semibold col-span-1 truncate">{row.product}</p>
                <p className="text-sm font-bold text-gray-800 text-center">{row.rate}</p>
                <p className="text-sm text-gray-600 text-center">{row.apr}</p>
                <p className="text-sm font-bold text-gray-800 text-center">{row.payment}</p>
              </div>
            ))}
          </div>

          {/* Email gate overlay card */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }}
              className="bg-white rounded-2xl shadow-xl px-6 py-5 w-full max-w-[280px] border border-gray-100"
            >
              {/* Lock icon */}
              <div className="flex justify-center mb-3">
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                  <Lock size={18} className="text-amber-500" />
                </div>
              </div>

              <p className="text-sm font-bold text-gray-900 text-center mb-3">
                Free and complete access in seconds
              </p>

              {/* Email input */}
              <div className="mb-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => {
                    onChange({ lead: { ...data.lead, email: e.target.value } });
                    setError('');
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleSubmit(); }}
                  className={`w-full px-3.5 py-2.5 border-2 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-300 focus:outline-none transition-all ${
                    error
                      ? 'border-red-400 focus:border-red-500'
                      : 'border-gray-200 focus:border-[#233B86]'
                  }`}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>

              {/* Continue button */}
              <motion.button
                onClick={handleSubmit}
                disabled={submitting}
                whileHover={!submitting ? { scale: 1.02 } : {}}
                whileTap={!submitting ? { scale: 0.97 } : {}}
                className="w-full py-2.5 rounded-xl font-bold text-sm text-white bg-[#EA2523] hover:bg-[#C41E1C] transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Opening rates...
                  </>
                ) : (
                  'Continue'
                )}
              </motion.button>

              <p className="text-[11px] text-center mt-2" style={{ color: '#757575' }}>• No SSN required •</p>
            </motion.div>
          </div>
        </div>

        {/* Reviews */}
        <div className="pt-4 mt-auto border-t border-gray-100">
          <p className="text-xs text-center mb-1.5" style={{ color: '#757575' }}>Reviews of Texas United Mortgage</p>
          <div className="flex items-center justify-center gap-2">
            {/* Google G */}
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-bold text-gray-700">5.0</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill="#F59E0B">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-xs" style={{ color: '#757575' }}>150+ reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
}
