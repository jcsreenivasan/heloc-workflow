import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, EmploymentStatus } from '../../../types/funnel';

interface StepThreeProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const EMPLOYMENT_STATUSES: { value: EmploymentStatus; label: string; sub: string; icon: string }[] = [
  { value: 'employed',      label: 'Employed',      sub: 'W-2 employee',          icon: '💼' },
  { value: 'self-employed', label: 'Self-Employed',  sub: '1099 / business owner', icon: '🏢' },
  { value: 'retired',       label: 'Retired',        sub: 'Fixed income',           icon: '☕' },
  { value: 'other',         label: 'Other',           sub: 'Not listed above',       icon: '•••' },
];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function BorrowSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const MIN = 10000;
  const MAX = 350000;
  const STEP = 5000;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Borrow Amount</span>
        <span className="text-2xl font-black text-[#1E3569]">{fmtCurrency(value)}</span>
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
          background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)`,
        }}
      />
      <div className="flex justify-between mt-2.5">
        <span className="text-xs text-gray-400">$10K</span>
        <span className="text-xs text-gray-400">$350K</span>
      </div>
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
};

export function StepThree({ data, onChange, onNext }: StepThreeProps) {
  const { borrowAmount, employmentStatus } = data;
  const canContinue = employmentStatus !== null;

  return (
    <div className="px-5 py-6">

      {/* Q7: Borrow amount slider */}
      <div className="pb-7">
        <h2 className="text-lg font-black text-gray-900 mb-4">
          How much are you looking to borrow?
        </h2>
        <BorrowSlider
          value={borrowAmount ?? 75000}
          onChange={v => onChange({ borrowAmount: v })}
        />
      </div>

      {/* Q8: Employment status */}
      <motion.div key="q8" {...reveal} className="border-t border-gray-100 pt-7">
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

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
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
