import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, PropertyType } from '../../../types/funnel';

interface StepOneProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
  onDisqualify: () => void;
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

function HomeValueSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const MIN = 50000;
  const MAX = 2000000;
  const STEP = 10000;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4">
      <div className="flex items-baseline justify-between mb-4">
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Home Value</span>
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
        <span className="text-xs text-gray-400">$50K</span>
        <span className="text-xs text-gray-400">$2.0M</span>
      </div>
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
};

export function StepOne({ data, onChange, onNext, onDisqualify }: StepOneProps) {
  const { ownsHome, propertyType, homeValue } = data;

  const selectOwnsHome = (val: boolean) => {
    onChange({ ownsHome: val, propertyType: null });
    if (!val) setTimeout(onDisqualify, 200);
  };

  const canContinue = ownsHome === true && propertyType !== null;

  return (
    <div className="px-5 py-6">

      {/* Q1: Own your home? */}
      <div className="pb-7">
        <h2 className="text-lg font-black text-gray-900 mb-4">Do you currently own your home?</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: true,  label: 'Yes, I Own', sub: "I'm a homeowner", img: '/own.png'  },
            { val: false, label: 'No, I Rent',  sub: 'I rent my home',  img: '/rent.png' },
          ].map(opt => {
            const selected = ownsHome === opt.val;
            return (
              <motion.button
                key={String(opt.val)}
                onClick={() => selectOwnsHome(opt.val)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${
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
                <img src={opt.img} alt={opt.label} className="w-20 h-20 object-contain mb-2" />
                <p className="text-sm font-bold text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.sub}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q2: Property type */}
      <AnimatePresence>
        {ownsHome === true && (
          <motion.div key="q2" {...reveal} className="border-t border-gray-100 pt-7 pb-7">
            <h2 className="text-lg font-black text-gray-900 mb-4">What type of property is it?</h2>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map(pt => {
                const selected = propertyType === pt.value;
                return (
                  <motion.button
                    key={pt.value}
                    onClick={() => onChange({ propertyType: pt.value })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex flex-col items-center text-center p-4 rounded-2xl border-2 transition-all ${
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
                    <img
                      src={pt.img}
                      alt={pt.label}
                      className="w-24 h-24 object-contain mb-2"
                    />
                    <p className="text-sm font-bold text-gray-900 leading-tight">{pt.label}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Q3: Home value slider */}
      <AnimatePresence>
        {ownsHome === true && propertyType !== null && (
          <motion.div key="q3" {...reveal} className="border-t border-gray-100 pt-7 pb-4">
            <h2 className="text-lg font-black text-gray-900 mb-4">
              What's the estimated current value of your home?
            </h2>
            <HomeValueSlider
              value={homeValue ?? 400000}
              onChange={v => onChange({ homeValue: v })}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-2">
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
