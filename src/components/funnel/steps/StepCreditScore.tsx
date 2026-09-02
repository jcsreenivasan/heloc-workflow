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
  { min: 500, max: 579, label: 'Poor', color: '#DC2626', bg: '#FEE2E2' },
  { min: 580, max: 669, label: 'Fair', color: '#EA580C', bg: '#FFEDD5' },
  { min: 670, max: 739, label: 'Good', color: '#CA8A04', bg: '#FEF9C3' },
  { min: 740, max: 850, label: 'Excellent', color: '#16A34A', bg: '#DCFCE7' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepCreditScore({ data, onChange, onNext }: StepCreditScoreProps) {
  const { label, color } = getCreditScoreLabel(data.creditScore);
  const currentBand = BANDS.find(b => data.creditScore >= b.min && data.creditScore <= b.max) || BANDS[3];

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-lg"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white" style={{ backgroundColor: '#EA2523' }}>
            Step 7 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            What's your credit score?
          </h1>
          <p className="text-gray-500 text-base">
            An estimate is fine — this won't affect your actual credit score.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          {/* Score Display */}
          <motion.div
            className="flex flex-col items-center py-4 rounded-xl border-2 transition-all duration-300"
            animate={{
              borderColor: currentBand.color,
              backgroundColor: currentBand.bg,
            }}
          >
            <motion.span
              key={data.creditScore}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="text-5xl font-black"
              style={{ color }}
            >
              {data.creditScore}
            </motion.span>
            <motion.span
              animate={{ color }}
              className="text-sm font-bold mt-1 uppercase tracking-wider"
            >
              {label}
            </motion.span>
          </motion.div>

          {/* Slider */}
          <SliderInput
            value={data.creditScore}
            min={500}
            max={850}
            step={10}
            onChange={val => onChange({ creditScore: val })}
            formatValue={v => v.toString()}
            color={color}
          />

          {/* Band indicators */}
          <div className="grid grid-cols-4 gap-1.5">
            {BANDS.map(band => (
              <div
                key={band.label}
                className="text-center p-2 rounded-lg border transition-all duration-200"
                style={{
                  backgroundColor: data.creditScore >= band.min && data.creditScore <= band.max ? band.bg : 'transparent',
                  borderColor: data.creditScore >= band.min && data.creditScore <= band.max ? band.color : '#E5E7EB',
                }}
              >
                <p className="text-xs font-bold" style={{ color: band.color }}>{band.label}</p>
                <p className="text-xs text-gray-400">{band.min}–{band.max}</p>
              </div>
            ))}
          </div>

          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            style={{ backgroundColor: '#EA2523' }}
          >
            Continue
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
