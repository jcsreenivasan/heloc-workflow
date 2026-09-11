import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, BorrowAmount, EmploymentStatus } from '../../../types/funnel';

interface StepThreeProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const BORROW_AMOUNTS: { value: BorrowAmount; label: string }[] = [
  { value: '<25k',       label: 'Under $25,000' },
  { value: '25k-50k',   label: '$25,000 – $50,000' },
  { value: '50k-100k',  label: '$50,000 – $100,000' },
  { value: '100k-150k', label: '$100,000 – $150,000' },
  { value: '150k+',     label: 'Over $150,000' },
];

const EMPLOYMENT_STATUSES: { value: EmploymentStatus; label: string; sub: string; icon: string }[] = [
  { value: 'employed',      label: 'Employed',      sub: 'W-2 employee',          icon: '💼' },
  { value: 'self-employed', label: 'Self-Employed',  sub: '1099 / business owner', icon: '🏢' },
  { value: 'retired',       label: 'Retired',        sub: 'Fixed income',           icon: '☕' },
  { value: 'other',         label: 'Other',           sub: 'Not listed above',       icon: '•••' },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
};

export function StepThree({ data, onChange, onNext }: StepThreeProps) {
  const { borrowAmount, employmentStatus } = data;
  const canContinue = borrowAmount !== null && employmentStatus !== null;

  return (
    <div className="px-5 py-6 space-y-7">

      {/* Q7: How much to borrow */}
      <div>
        <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 7</p>
        <h2 className="text-lg font-black text-gray-900 mb-4">
          How much are you looking to borrow?
        </h2>
        <div className="space-y-2">
          {BORROW_AMOUNTS.map(ba => {
            const selected = borrowAmount === ba.value;
            return (
              <motion.button
                key={ba.value}
                onClick={() => onChange({ borrowAmount: ba.value, employmentStatus: null })}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className={`text-sm font-semibold ${selected ? 'text-[#EA2523]' : 'text-gray-800'}`}>
                  {ba.label}
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

      {/* Q8: Employment status */}
      <AnimatePresence>
        {borrowAmount !== null && (
          <motion.div key="q8" {...reveal}>
            <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 8</p>
            <h2 className="text-lg font-black text-gray-900 mb-4">
              What's your employment status?
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {EMPLOYMENT_STATUSES.map(es => {
                const selected = employmentStatus === es.value;
                return (
                  <motion.button
                    key={es.value}
                    onClick={() => onChange({ employmentStatus: es.value })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${
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
                    <span className="text-2xl mb-2">{es.icon}</span>
                    <p className="text-sm font-bold text-gray-900">{es.label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{es.sub}</p>
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
              See My HELOC Options
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
