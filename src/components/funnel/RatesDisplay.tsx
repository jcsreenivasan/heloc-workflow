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

function HELOCSummary({
  data,
  equity,
  maxLine,
  alwaysOpen = false,
}: {
  data: FunnelData;
  equity: number;
  maxLine: number;
  alwaysOpen?: boolean;
}) {
  const [open, setOpen] = useState(alwaysOpen);

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
      {alwaysOpen ? (
        <div className="flex items-center gap-2 px-4 py-3">
          <Check size={15} className="text-[#233B86]" />
          <span className="text-sm font-bold text-[#233B86]">Your HELOC Profile</span>
        </div>
      ) : (
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
      )}

      <motion.div
        initial={false}
        animate={{ height: (alwaysOpen || open) ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-3">
          {rows.map((r, i) => (
            <div
              key={r.label}
              className={`flex justify-between items-center px-2 py-2.5 rounded-md ${i % 2 === 0 ? 'bg-white/60' : ''}`}
            >
              <span className="text-sm text-gray-900 shrink-0">{r.label}</span>
              <span className="text-xs font-bold text-[#1E3569] text-right ml-4">{r.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

const LOW_CREDIT_STEPS = [
  {
    num: '1',
    title: 'Profile Review',
    desc: 'Our team reviews your submission and credit profile in detail.',
  },
  {
    num: '2',
    title: 'Specialist Outreach',
    desc: 'A dedicated home equity specialist contacts you within 1 business day.',
  },
  {
    num: '3',
    title: 'Personalized Plan',
    desc: 'We build a strategy tailored to your home equity goals and timeline.',
  },
];

function LowCreditCard({ data }: { data: FunnelData }) {
  const firstName = data.lead.name ? data.lead.name.split(' ')[0] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring', stiffness: 260, damping: 24 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-7 pb-5 text-center border-b border-gray-100">
        <div className="flex justify-center mb-3">
          <div className="w-14 h-14 rounded-full border-2 border-green-500 flex items-center justify-center">
            <Check size={28} className="text-green-500" strokeWidth={2.5} />
          </div>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">
          {firstName ? `You're all set, ${firstName}!` : "You're all set!"}
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: '#757575' }}>
          Our team will review your profile and a home equity specialist
          will reach out within{' '}
          <span className="font-semibold text-gray-800">1 business day</span>.
        </p>
      </div>

      {/* What happens next */}
      <div className="px-6 py-5">
        <p className="text-[11px] font-black uppercase tracking-widest mb-4" style={{ color: '#757575' }}>
          What happens next
        </p>
        <div className="space-y-4">
          {LOW_CREDIT_STEPS.map(s => (
            <div key={s.num} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1E3569] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[11px] font-black text-white">{s.num}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-tight">{s.title}</p>
                <p className="text-xs mt-0.5 leading-snug" style={{ color: '#757575' }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <div className="h-px bg-gray-100 mb-5" />
        <p className="text-sm font-semibold text-gray-900 mb-3 text-center">
          Ready to start your application now?
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-bold text-white text-base bg-[#233B86] hover:bg-[#1A2B63] transition-colors"
        >
          Apply Now
        </motion.button>
      </div>
    </motion.div>
  );
}

export function RatesDisplay({ data }: RatesDisplayProps) {
  const { rates, equity, maxLineAmount } = calculateRates(data);
  const isLowCredit = (data.creditScore ?? 700) < 600;

  return (
    <div className="px-4 py-5 bg-gray-50">
      {!isLowCredit && <ConfettiEffect />}

      {isLowCredit ? (
        /* Low credit — "You're all set" first, then profile, no rate cards */
        <>
          <LowCreditCard data={data} />
          <div className="mt-4">
            <HELOCSummary data={data} equity={equity} maxLine={maxLineAmount} alwaysOpen />
          </div>
        </>
      ) : (
        <>
          {/* Title — normal flow only */}
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

          {/* HELOC profile */}
          <div className="mb-4">
            <HELOCSummary data={data} equity={equity} maxLine={maxLineAmount} />
          </div>

          {/* Rate cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {rates.map((rate, i) => (
              <HELOCRateCard key={rate.type} rate={rate} index={i} />
            ))}
          </div>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            Estimates only. Not a commitment to lend. Rates and credit lines subject to credit verification,
            appraisal, and underwriting approval. Texas United Mortgage — NMLS #46749.
          </p>
        </>
      )}
    </div>
  );
}
