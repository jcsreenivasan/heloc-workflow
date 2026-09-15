import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, CreditBand, UseOfFunds } from '../../../types/funnel';

interface StepTwoProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

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

function fmt(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n);
}

function MortgageSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const MIN = 0;
  const MAX = 700000;
  const STEP = 5000;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div>
      <div className="flex justify-center mb-5">
        <div className="bg-[#EA2523]/8 rounded-2xl px-8 py-3">
          <p className="text-2xl font-black text-[#EA2523] text-center">
            {value === 0 ? 'None / Paid Off' : fmt(value)}
          </p>
        </div>
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{
          background: `linear-gradient(to right, #EA2523 ${pct}%, #E5E7EB ${pct}%)`,
        }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs text-gray-400">None</span>
        <span className="text-xs text-gray-400">{fmt(MAX)}</span>
      </div>
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
};

export function StepTwo({ data, onChange, onNext }: StepTwoProps) {
  const { mortgageBalance, creditBand, useOfFunds } = data;
  const canContinue = creditBand !== null && useOfFunds !== null;

  return (
    <div className="px-5 py-6 space-y-7">

      {/* Q4: Mortgage balance slider */}
      <div>
        <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 4</p>
        <h2 className="text-lg font-black text-gray-900 mb-5">
          What's your remaining mortgage balance?
        </h2>
        <MortgageSlider
          value={mortgageBalance ?? 0}
          onChange={v => onChange({ mortgageBalance: v })}
        />
      </div>

      {/* Q5: Credit score band — always visible alongside Q4 */}
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

      {/* Q6: Use of funds */}
      <AnimatePresence>
        {creditBand !== null && (
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
              className="w-full py-3.5 bg-[#EA2523] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#EA2523]/20 flex items-center justify-center gap-2"
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
