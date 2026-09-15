import { motion } from 'framer-motion';
import type { FunnelData } from '../../../types/funnel';

interface StepTwoProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

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

export function StepTwo({ data, onChange, onNext }: StepTwoProps) {
  const { creditScore } = data;
  const score = creditScore ?? 700;
  const active = getActiveBand(score);
  const MIN = 500, MAX = 850;
  const pct = ((score - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="px-5 py-4">
      <h2 className="text-base font-black text-gray-900 mb-4">What's your credit score?</h2>

      {/* Score display */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: '#757575' }}>Your Score</p>
          <p className="text-7xl font-black leading-none" style={{ color: active.color }}>{score}</p>
        </div>
        <div className="text-right mt-1">
          <p className="text-xl font-bold" style={{ color: active.color }}>{active.label}</p>
          <p className="text-sm mt-1 leading-relaxed max-w-[180px]" style={{ color: '#757575' }}>{BAND_MESSAGES[active.label]}</p>
        </div>
      </div>

      {/* Slider */}
      <input
        type="range" min={MIN} max={MAX} step={1} value={score}
        onChange={e => onChange({ creditScore: Number(e.target.value) })}
        className="slider-input w-full mb-4"
        style={{ background: `linear-gradient(to right, ${active.color} ${pct}%, #E5E7EB ${pct}%)` }}
      />

      {/* Band pills */}
      <div className="grid grid-cols-4 gap-1.5 mb-6">
        {BANDS.map(band => {
          const isActive = score >= band.min && score <= band.max;
          return (
            <div
              key={band.label}
              className={`rounded-xl px-2 py-2 text-center border-2 transition-all ${isActive ? '' : 'border-transparent bg-gray-50'}`}
              style={isActive ? { borderColor: band.color + '50', backgroundColor: band.color + '15' } : {}}
            >
              <p className="text-xs font-bold" style={{ color: band.color }}>{band.label}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#757575' }}>{band.range}</p>
            </div>
          );
        })}
      </div>

      {/* Continue */}
      <motion.button
        onClick={onNext}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
      >
        Continue
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </div>
  );
}
