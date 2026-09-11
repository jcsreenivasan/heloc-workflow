import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, PropertyType, HomeValue } from '../../../types/funnel';

interface StepOneProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
  onDisqualify: () => void;
}

const PROPERTY_TYPES: { value: PropertyType; label: string; icon: string; color: string }[] = [
  { value: 'single-family', label: 'Single-Family Home', icon: '🏠', color: '#6366F1' },
  { value: 'condo',         label: 'Condo',              icon: '🏢', color: '#0D9488' },
  { value: 'multi-family',  label: 'Multi-Family',       icon: '🏘️', color: '#F59E0B' },
  { value: 'manufactured',  label: 'Manufactured Home',  icon: '🏡', color: '#EC4899' },
];

const HOME_VALUES: { value: HomeValue; label: string }[] = [
  { value: '<200k',     label: 'Less than $200,000' },
  { value: '200k-400k', label: '$200,000 – $400,000' },
  { value: '400k-600k', label: '$400,000 – $600,000' },
  { value: '600k-1m',   label: '$600,000 – $1,000,000' },
  { value: '1m+',       label: 'Over $1,000,000' },
];

const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.32, ease: 'easeOut' as const },
};

export function StepOne({ data, onChange, onNext, onDisqualify }: StepOneProps) {
  const { ownsHome, propertyType, homeValue } = data;

  const selectOwnsHome = (val: boolean) => {
    onChange({ ownsHome: val, propertyType: null, homeValue: null });
    if (!val) {
      setTimeout(onDisqualify, 200);
    }
  };

  const canContinue = ownsHome === true && propertyType !== null && homeValue !== null;

  return (
    <div className="px-5 py-6 space-y-7">

      {/* Q1: Own your home? */}
      <div>
        <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 1</p>
        <h2 className="text-lg font-black text-gray-900 mb-4">Do you currently own your home?</h2>
        <div className="grid grid-cols-2 gap-3">
          {[
            { val: true,  label: 'Yes, I Own',   sub: "I'm a homeowner",  icon: '🏡', color: '#16A34A' },
            { val: false, label: 'No, I Rent',    sub: 'I rent my home',   icon: '🔑', color: '#6B7280' },
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
                <span className="text-2xl mb-2">{opt.icon}</span>
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
          <motion.div key="q2" {...reveal}>
            <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 2</p>
            <h2 className="text-lg font-black text-gray-900 mb-4">What type of property is it?</h2>
            <div className="grid grid-cols-2 gap-3">
              {PROPERTY_TYPES.map(pt => {
                const selected = propertyType === pt.value;
                return (
                  <motion.button
                    key={pt.value}
                    onClick={() => onChange({ propertyType: pt.value, homeValue: null })}
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
                    <span className="text-2xl mb-2">{pt.icon}</span>
                    <p className="text-sm font-bold text-gray-900">{pt.label}</p>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Q3: Home value */}
      <AnimatePresence>
        {ownsHome === true && propertyType !== null && (
          <motion.div key="q3" {...reveal}>
            <p className="text-[11px] font-bold text-[#EA2523] uppercase tracking-widest mb-1">Question 3</p>
            <h2 className="text-lg font-black text-gray-900 mb-4">
              What's the estimated current value of your home?
            </h2>
            <div className="space-y-2">
              {HOME_VALUES.map(hv => {
                const selected = homeValue === hv.value;
                return (
                  <motion.button
                    key={hv.value}
                    onClick={() => onChange({ homeValue: hv.value })}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-left transition-all ${
                      selected
                        ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm font-semibold ${selected ? 'text-[#EA2523]' : 'text-gray-800'}`}>
                      {hv.label}
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
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(234,37,35,0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-[#EA2523] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#EA2523]/20 transition-all flex items-center justify-center gap-2"
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
