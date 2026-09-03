import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SliderInput } from '../../ui/SliderInput';
import type { FunnelData } from '../../../types/funnel';
import { getCreditScoreLabel } from '../../../utils/rateCalculator';

interface StepCreditScoreProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const BANDS = [
  { min: 500, max: 579, label: 'Poor',      color: '#DC2626', bg: '#FEF2F2' },
  { min: 580, max: 669, label: 'Fair',      color: '#EA580C', bg: '#FFF7ED' },
  { min: 670, max: 739, label: 'Good',      color: '#CA8A04', bg: '#FEFCE8' },
  { min: 740, max: 850, label: 'Excellent', color: '#16A34A', bg: '#F0FDF4' },
];

export function StepCreditScore({ data, onChange, onNext }: StepCreditScoreProps) {
  const { label, color } = getCreditScoreLabel(data.creditScore);
  const band = BANDS.find(b => data.creditScore >= b.min && data.creditScore <= b.max) || BANDS[3];

  return (
    <div className="px-5 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1">What's your credit score?</h2>
          <p className="text-sm text-gray-500">An estimate is fine — no credit check needed.</p>
        </div>

        {/* Score display */}
        <motion.div
          animate={{ backgroundColor: band.bg, borderColor: `${band.color}40` }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-between px-5 py-4 rounded-xl border-2 mb-6"
        >
          <div>
            <p className="text-xs text-gray-400 mb-0.5 font-medium uppercase tracking-wide">Your Score</p>
            <motion.p
              key={data.creditScore}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-black tabular-nums"
              style={{ color }}
            >
              {data.creditScore}
            </motion.p>
          </div>
          <motion.div
            animate={{ backgroundColor: `${band.color}15`, color: band.color }}
            className="px-3 py-1.5 rounded-lg text-sm font-bold"
          >
            {label}
          </motion.div>
        </motion.div>

        <SliderInput
          value={data.creditScore}
          min={500}
          max={850}
          step={10}
          onChange={val => onChange({ creditScore: val })}
          formatValue={v => v.toString()}
          color={color}
        />

        {/* Band rail */}
        <div className="grid grid-cols-4 gap-1.5 mt-5">
          {BANDS.map(b => {
            const active = data.creditScore >= b.min && data.creditScore <= b.max;
            return (
              <div
                key={b.label}
                className="text-center py-1.5 px-1 rounded-lg border transition-all duration-200"
                style={{
                  backgroundColor: active ? b.bg : 'transparent',
                  borderColor: active ? `${b.color}50` : '#F3F4F6',
                }}
              >
                <p className="text-xs font-bold" style={{ color: b.color }}>{b.label}</p>
                <p className="text-xs text-gray-400">{b.min}–{b.max}</p>
              </div>
            );
          })}
        </div>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-7 py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-[#EA2523] shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C] transition-colors"
        >
          Continue <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
