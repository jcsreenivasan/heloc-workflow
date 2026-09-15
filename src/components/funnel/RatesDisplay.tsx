import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { FunnelData, RateData } from '../../types/funnel';
import { calculateRates, creditScoreLabel } from '../../utils/rateCalculator';

interface RatesDisplayProps {
  data: FunnelData;
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function useCountUp(target: number, ms = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / ms, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(target * e);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [target, ms]);
  return val;
}

function ConfettiEffect() {
  const colors = ['#EA2523', '#233B86', '#FFD700', '#16A34A', '#ffffff'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{ left: `${Math.random() * 100}%`, backgroundColor: colors[i % colors.length] }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{
            y: window.innerHeight,
            opacity: [1, 1, 0],
            rotate: Math.random() * 540 - 270,
            x: Math.random() * 160 - 80,
          }}
          transition={{ duration: 1.8 + Math.random() * 1.2, delay: Math.random() * 0.6, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

function HELOCRateCard({
  rate,
  index,
}: {
  rate: RateData;
  index: number;
}) {
  const rateAnim = useCountUp(rate.interestRate);
  const paymentAnim = useCountUp(rate.monthlyPayment);

  const isHeloc = rate.type === 'heloc';
  const isPrimary = index === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.12, type: 'spring', stiffness: 280, damping: 26 }}
      className={`bg-white rounded-xl border-2 overflow-hidden ${
        isPrimary ? 'border-[#EA2523]' : 'border-gray-200'
      }`}
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gray-50 border-b border-gray-100">
        <div>
          <p className="text-sm font-bold text-gray-800">{rate.label}</p>
          <p className="text-xs mt-0.5" style={{ color: '#757575' }}>
            {rate.isVariableRate ? 'Variable rate · Interest-only draw' : 'Fixed rate · Fully amortized'}
          </p>
        </div>
        {rate.badge && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#EA2523] text-white">
            {rate.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Rate + payment */}
        <div className="flex items-end justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs mb-0.5" style={{ color: '#757575' }}>
              {rate.isVariableRate ? 'Current Rate (Variable)' : 'Interest Rate (Fixed)'}
            </p>
            <p className="text-3xl font-black text-[#233B86]">
              {rateAnim.toFixed(2)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs mb-0.5" style={{ color: '#757575' }}>
              {isHeloc ? 'Est. Interest-Only' : 'Est. Monthly'}
            </p>
            <p className="text-xl font-bold text-[#EA2523]">
              {fmtCurrency(paymentAnim)}
              <span className="text-xs font-normal" style={{ color: '#757575' }}>/mo</span>
            </p>
          </div>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'APR', value: `${rate.apr.toFixed(2)}%` },
            { label: 'Line / Loan Amount', value: fmtCurrency(rate.loanAmount) },
            ...(isHeloc
              ? [{ label: 'Draw Period', value: rate.drawPeriod ?? '10 years' }]
              : []),
            { label: 'Repayment', value: rate.repaymentPeriod },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs" style={{ color: '#757575' }}>{item.label}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Apply Now */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 rounded-xl font-bold text-white text-sm bg-[#EA2523] hover:bg-[#C41E1C] transition-colors"
        >
          Apply Now
        </motion.button>
      </div>
    </motion.div>
  );
}

function HELOCSummary({ data, equity, maxLine }: { data: FunnelData; equity: number; maxLine: number }) {
  const [open, setOpen] = useState(false);

  function humanize(val: string): string {
    return val.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  const rows = [
    { label: 'Property Type', value: data.propertyType ? humanize(data.propertyType) : '—' },
    { label: 'Est. Home Value', value: data.homeValue ? fmtCurrency(data.homeValue) : '—' },
    { label: 'Mortgage Balance', value: data.mortgageBalance === 0 ? 'None / Paid Off' : data.mortgageBalance ? fmtCurrency(data.mortgageBalance) : '—' },
    { label: 'Est. Available Equity', value: fmtCurrency(equity) },
    { label: 'Max Credit Line (85% CLTV)', value: fmtCurrency(maxLine) },
    { label: 'Credit Score', value: data.creditScore ? creditScoreLabel(data.creditScore) : '—' },
    { label: 'Use of Funds', value: data.useOfFunds ? humanize(data.useOfFunds) : '—' },
    { label: 'Amount Requested', value: data.borrowAmount ? fmtCurrency(data.borrowAmount) : '—' },
    { label: 'Employment', value: data.employmentStatus ? humanize(data.employmentStatus) : '—' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-[#EEF1FB] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Check size={15} className="text-[#233B86]" />
          <span className="text-sm font-bold text-[#233B86]">Your HELOC Profile</span>
        </div>
        {open ? <ChevronUp size={15} className="text-[#233B86]" /> : <ChevronDown size={15} className="text-[#233B86]" />}
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-4 space-y-2">
          {rows.map(r => (
            <div key={r.label} className="flex justify-between items-center">
              <span className="text-xs text-gray-500">{r.label}</span>
              <span className="text-xs font-semibold text-gray-700 text-right ml-4">{r.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function RatesDisplay({ data }: RatesDisplayProps) {
  const { rates, equity, maxLineAmount } = calculateRates(data);

  return (
    <div className="px-4 py-5 bg-gray-50">
      <ConfettiEffect />

      {/* Title */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-2 h-2 rounded-full bg-[#EA2523]"
          />
          <span className="text-xs font-bold uppercase tracking-widest text-[#EA2523]">
            Live Estimates · Updated Today
          </span>
        </div>
        <h2 className="text-xl font-black text-gray-900">Your Personalized HELOC Options</h2>
        {data.lead.name && (
          <p className="text-sm text-gray-500 mt-0.5">
            Hi {data.lead.name.split(' ')[0]}! Here's your estimated HELOC breakdown:
          </p>
        )}
      </motion.div>

      {/* HELOC summary accordion */}
      <div className="mb-4">
        <HELOCSummary data={data} equity={equity} maxLine={maxLineAmount} />
      </div>

      {/* Rate cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {rates.map((rate, i) => (
          <HELOCRateCard
            key={rate.type}
            rate={rate}
            index={i}
          />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Estimates only. Not a commitment to lend. Rates and credit lines subject to credit verification,
        appraisal, and underwriting approval. Texas United Mortgage — NMLS #46749.
      </p>
    </div>
  );
}
