import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, PropertyType } from '../../../types/funnel';

interface StepOneProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string; img: string }[] = [
  { value: 'single-family', label: 'Single-Family Home', img: '/icons/single-family.png' },
  { value: 'condo',         label: 'Condo',              img: '/icons/condo.png'          },
  { value: 'townhome',      label: 'Townhome',           img: '/icons/townhome.png'       },
  { value: 'multi-unit',    label: 'Multi-Unit',         img: '/icons/multi-unit.png'     },
];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

function HomeValueSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const MIN = 50000, MAX = 2000000, STEP = 10000;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Home Value</span>
        <span className="text-xl font-black text-[#1E3569]">{fmtCurrency(value)}</span>
      </div>
      <input
        type="range" min={MIN} max={MAX} step={STEP} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{ background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)` }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: '#757575' }}>$50K</span>
        <span className="text-xs" style={{ color: '#757575' }}>$2.0M</span>
      </div>
    </div>
  );
}

function MortgageSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const MIN = 0, MAX = 700000, STEP = 5000;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Mortgage Balance</span>
        <span className="text-xl font-black text-[#1E3569]">
          {value === 0 ? 'None / Paid Off' : fmtCurrency(value)}
        </span>
      </div>
      <input
        type="range" min={MIN} max={MAX} step={STEP} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{ background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)` }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: '#757575' }}>None</span>
        <span className="text-xs" style={{ color: '#757575' }}>$700K</span>
      </div>
    </div>
  );
}

export function StepOne({ data, onChange, onNext }: StepOneProps) {
  const { propertyType, homeValue, mortgageBalance } = data;
  const canContinue = propertyType !== null;

  return (
    <div className="px-5 py-5">

      {/* Q1: Property type */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={1} />
          <h2 className="text-base font-black text-gray-900">What is the property type?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {PROPERTY_TYPES.map(pt => {
            const selected = propertyType === pt.value;
            return (
              <motion.button
                key={pt.value}
                onClick={() => onChange({ propertyType: pt.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5'
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
                <img src={pt.img} alt={pt.label} className="w-16 h-16 object-contain mb-1.5" />
                <p className="text-sm font-bold text-gray-900 leading-tight">{pt.label}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q2: Home value */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={2} />
          <h2 className="text-base font-black text-gray-900">What's the estimated value of your home?</h2>
        </div>
        <HomeValueSlider
          value={homeValue ?? 400000}
          onChange={v => onChange({ homeValue: v })}
        />
      </div>

      {/* Q3: Mortgage balance */}
      <div className="border-t-2 border-gray-100 pt-6 pb-3">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={3} />
          <h2 className="text-base font-black text-gray-900">What's your remaining mortgage balance?</h2>
        </div>
        <MortgageSlider
          value={mortgageBalance ?? 150000}
          onChange={v => onChange({ mortgageBalance: v })}
        />
      </div>

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
