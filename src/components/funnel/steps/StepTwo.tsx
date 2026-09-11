import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, MortgageBalance, CreditBand, UseOfFunds } from '../../../types/funnel';

interface StepTwoProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const MORTGAGE_BALANCES: { value: MortgageBalance; label: string }[] = [
  { value: 'none',       label: 'None / Paid Off' },
  { value: '<50k',       label: 'Under $50,000' },
  { value: '50k-100k',   label: '$50,000 – $100,000' },
  { value: '100k-200k',  label: '$100,000 – $200,000' },
  { value: '200k-300k',  label: '$200,000 – $300,000' },
  { value: '300k+',      label: '$300,000 or more' },
];

const CREDIT_BANDS: { value: CreditBand; label: string; sub: string; color: string; bg: string }[] = [
  { value: 'excellent', label: 'Excellent', sub: '720 or higher',  color: '#16A34A', bg: '#F0FDF4' },
  { value: 'good',      label: 'Good',      sub: '660 – 719',      color: '#CA8A04', bg: '#FEFCE8' },
  { value: 'fair',      label: 'Fair',      sub: '600 – 659',      color: '#EA580C', bg: '#FFF7ED' },
  { value: 'poor',      label: 'Poor',      sub: 'Below 600',      color: '#DC2626', bg: '#FEF2F2' },
];

const FUND_USES: { value: UseOfFunds; label: string; icon: string }[] = [
  { value: 'home-improvement',   label: 'Home Improvement',   icon: '🔨' },
  { value: 'debt-consolidation', label: 'Debt Consolidation', icon: '💳' },
  { value: 'major-purchase',     label: 'Major Purchase',     icon: '🛒' },
  { value: 'emergency-fund',     label: 'Emergency Fund',     icon: '🛡️' },
  { value: 'other',              label: 'Other',              icon: '•••' },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
};

export function StepTwo({ data, onChange, onNext }: StepTwoProps) {
  const { mortgageBalance, creditBand, useOfFunds } = data;
  const canContinue = mortgageBalance !== null && creditBand !== null && useOfFunds !== null;

  return (
    <div className="px-5 py-6 space-y-7">

      {/* Q4: Mortgage balance */}
      <div>
        <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 4</p>
        <h2 className="text-lg font-black text-gray-900 mb-4">
          What's your remaining mortgage balance?
        </h2>
        <div className="space-y-2">
          {MORTGAGE_BALANCES.map(mb => {
            const selected = mortgageBalance === mb.value;
            return (
              <motion.button
                key={mb.value}
                onClick={() => onChange({ mortgageBalance: mb.value, creditBand: null, useOfFunds: null })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`text-sm font-semibold ${selected ? 'text-[#EA2523]' : 'text-gray-800'}`}>
                  {mb.label}
                </span>
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q5: Credit score band */}
      <AnimatePresence>
        {mortgageBalance !== null && (
          <motion.div key="q5" {...reveal}>
            <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 5</p>
            <h2 className="text-lg font-black text-gray-900 mb-4">
              What's your estimated credit score?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {CREDIT_BANDS.map(cb => {
                const selected = creditBand === cb.value;
                return (
                  <motion.button
                    key={cb.value}
                    onClick={() => onChange({ creditBand: cb.value, useOfFunds: null })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex flex-col items-start p-4 rounded-2xl border-2 text-left transition-all ${
                      selected
                        ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-2 right-2 w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center"
                      >
                        <Check size={11} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    <span
                      className="text-xs font-bold mb-1 px-2 py-0.5 rounded-full"
                      style={{ color: cb.color, backgroundColor: cb.bg }}
                    >
                      {cb.label}
                    </span>
                    <span className="text-sm font-semibold text-gray-700">{cb.sub}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Q6: Use of funds */}
      <AnimatePresence>
        {mortgageBalance !== null && creditBand !== null && (
          <motion.div key="q6" {...reveal}>
            <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 6</p>
            <h2 className="text-lg font-black text-gray-900 mb-4">
              What do you plan to use the funds for?
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              {FUND_USES.map(fu => {
                const selected = useOfFunds === fu.value;
                return (
                  <motion.button
                    key={fu.value}
                    onClick={() => onChange({ useOfFunds: fu.value })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex flex-col items-center text-center p-3.5 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    } ${fu.value === 'other' ? 'col-span-2' : ''}`}
                  >
                    {selected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EA2523] rounded-full flex items-center justify-center"
                      >
                        <Check size={9} className="text-white" strokeWidth={3} />
                      </motion.div>
                    )}
                    <span className="text-xl mb-1">{fu.icon}</span>
                    <span className="text-xs font-bold text-gray-800">{fu.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(234,37,35,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-[#EA2523] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#EA2523]/20 transition-all flex items-center justify-center gap-2"
            >
              Continue
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
