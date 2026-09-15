import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, UseOfFunds } from '../../../types/funnel';

interface StepTwoProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const FUND_USES: { value: UseOfFunds; label: string; icon: string }[] = [
  { value: 'home-improvement',   label: 'Home Improvement',   icon: '🔨' },
  { value: 'debt-consolidation', label: 'Debt Consolidation', icon: '💳' },
  { value: 'major-purchase',     label: 'Major Purchase',     icon: '🛒' },
  { value: 'emergency-fund',     label: 'Emergency Fund',     icon: '🛡️' },
  { value: 'other',              label: 'Other',              icon: '•••' },
];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

// ─── Mortgage balance slider ────────────────────────────────────────────────
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
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Mortgage Balance</span>
        <span className="text-2xl font-black text-[#1E3569]">
          {value === 0 ? 'None / Paid Off' : fmtCurrency(value)}
        </span>
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
        <span className="text-xs text-gray-400">None</span>
        <span className="text-xs text-gray-400">$700K</span>
      </div>
    </div>
  );
}

// ─── Credit score slider ────────────────────────────────────────────────────
const BANDS = [
  { label: 'Poor',      range: '500–579', min: 500, max: 579, color: '#DC2626' },
  { label: 'Fair',      range: '580–669', min: 580, max: 669, color: '#EA580C' },
  { label: 'Good',      range: '670–739', min: 670, max: 739, color: '#CA8A04' },
  { label: 'Excellent', range: '740–850', min: 740, max: 850, color: '#16A34A' },
];

const BAND_MESSAGES: Record<string, string> = {
  Poor:      'You may still qualify. Some options available.',
  Fair:      'Consider improving before applying.',
  Good:      "You're in a solid range. A few more points can unlock the best rates.",
  Excellent: 'You qualify for our best rates!',
};

function getActiveBand(score: number) {
  return BANDS.find(b => score >= b.min && score <= b.max) ?? BANDS[2];
}

function CreditScoreSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const MIN = 500;
  const MAX = 850;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  const active = getActiveBand(value);

  return (
    <div className="space-y-4">
      {/* Score display */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">Your Score</p>
          <p className="text-6xl font-black leading-none" style={{ color: active.color }}>
            {value}
          </p>
        </div>
        <div className="text-right mt-1">
          <p className="text-lg font-bold" style={{ color: active.color }}>
            {active.label}
          </p>
          <p className="text-xs text-gray-400 mt-1 leading-relaxed max-w-[160px]">
            {BAND_MESSAGES[active.label]}
          </p>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{
          background: `linear-gradient(to right, ${active.color} ${pct}%, #E5E7EB ${pct}%)`,
        }}
      />

      {/* Band tabs */}
      <div className="grid grid-cols-4 gap-1.5">
        {BANDS.map(band => {
          const isActive = value >= band.min && value <= band.max;
          return (
            <div
              key={band.label}
              className={`rounded-xl px-2 py-2.5 text-center border-2 transition-all ${
                isActive ? '' : 'border-transparent bg-gray-50'
              }`}
              style={isActive ? { borderColor: band.color + '50', backgroundColor: band.color + '15' } : {}}
            >
              <p className="text-xs font-bold" style={{ color: band.color }}>
                {band.label}
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5">{band.range}</p>
            </div>
          );
        })}
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
  const { mortgageBalance, creditScore, useOfFunds } = data;
  const canContinue = useOfFunds !== null;

  return (
    <div className="px-5 py-6 space-y-7">

      {/* Q4: Mortgage balance slider */}
      <div>
        <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 4</p>
        <h2 className="text-lg font-black text-gray-900 mb-4">
          What's your remaining mortgage balance?
        </h2>
        <MortgageSlider
          value={mortgageBalance ?? 0}
          onChange={v => onChange({ mortgageBalance: v })}
        />
      </div>

      {/* Q5: Credit score slider */}
      <motion.div key="q5" {...reveal}>
        <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 5</p>
        <h2 className="text-lg font-black text-gray-900 mb-4">
          What's your credit score?
        </h2>
        <CreditScoreSlider
          value={creditScore ?? 700}
          onChange={v => onChange({ creditScore: v })}
        />
      </motion.div>

      {/* Q6: Use of funds */}
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

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
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
