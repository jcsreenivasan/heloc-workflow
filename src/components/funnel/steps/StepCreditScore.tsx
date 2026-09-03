import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';
import { getCreditScoreLabel } from '../../../utils/rateCalculator';

interface Props { data: FunnelData; onChange: (u: Partial<FunnelData>) => void; onNext: () => void; }

const BANDS = [
  { min: 500, max: 579, label: 'Poor',      color: '#DC2626', bg: '#FEF2F2', track: '#FCA5A5' },
  { min: 580, max: 669, label: 'Fair',      color: '#EA580C', bg: '#FFF7ED', track: '#FDB57B' },
  { min: 670, max: 739, label: 'Good',      color: '#D97706', bg: '#FFFBEB', track: '#FCD34D' },
  { min: 740, max: 850, label: 'Excellent', color: '#16A34A', bg: '#F0FDF4', track: '#6EE7B7' },
];

const TIPS: Record<string, string> = {
  Poor:      'A score below 580 may limit loan options. FHA loans may still be available.',
  Fair:      'Some conventional loans are available. Improving your score can lower your rate.',
  Good:      "You're in a solid range. A few more points can unlock the best rates.",
  Excellent: 'Great score! You qualify for our most competitive interest rates.',
};

export function StepCreditScore({ data, onChange, onNext }: Props) {
  const { label, color } = getCreditScoreLabel(data.creditScore);
  const band = BANDS.find(b => data.creditScore >= b.min && data.creditScore <= b.max) || BANDS[3];
  const pct  = ((data.creditScore - 500) / (850 - 500)) * 100;

  return (
    <div>
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-violet-50/70 to-white">
        <div className="w-12 h-12 rounded-2xl bg-violet-100 flex items-center justify-center mb-4">
          <TrendingUp size={24} className="text-violet-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">What's your credit score?</h2>
        <p className="text-sm text-gray-500">An estimate is fine — this won't affect your actual score.</p>
      </div>

      <div className="px-6 pb-7 space-y-5">
        {/* Big score display */}
        <motion.div
          animate={{ backgroundColor: band.bg, borderColor: `${band.color}35` }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between px-5 py-5 rounded-2xl border-2"
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Your Score</p>
            <motion.p
              key={data.creditScore}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-5xl font-black tabular-nums leading-none"
              style={{ color }}
            >
              {data.creditScore}
            </motion.p>
          </div>
          <motion.div
            animate={{ backgroundColor: `${band.color}18` }}
            className="text-right"
          >
            <p className="text-lg font-extrabold" style={{ color }}>{label}</p>
            <p className="text-xs mt-1 max-w-[140px] text-right leading-snug" style={{ color: `${band.color}99` }}>
              {TIPS[label]}
            </p>
          </motion.div>
        </motion.div>

        {/* Slider */}
        <div className="px-1">
          <input
            type="range"
            min={500}
            max={850}
            step={10}
            value={data.creditScore}
            onChange={e => onChange({ creditScore: Number(e.target.value) })}
            className="slider-input w-full"
            style={{
              background: `linear-gradient(to right, ${color} ${pct}%, #E5E7EB ${pct}%)`,
              accentColor: color,
            }}
          />
        </div>

        {/* Band labels */}
        <div className="grid grid-cols-4 gap-2">
          {BANDS.map(b => {
            const active = data.creditScore >= b.min && data.creditScore <= b.max;
            return (
              <motion.div
                key={b.label}
                animate={{
                  backgroundColor: active ? b.bg : '#F9FAFB',
                  borderColor: active ? `${b.color}45` : '#F3F4F6',
                }}
                className="text-center py-2 px-1 rounded-xl border transition-colors"
              >
                <p className="text-xs font-extrabold" style={{ color: b.color }}>{b.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{b.min}–{b.max}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 bg-[#EA2523] shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C] transition-colors"
        >
          Continue <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
