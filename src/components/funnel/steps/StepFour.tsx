import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepFourProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

export function StepFour({ data, onChange, onNext }: StepFourProps) {
  const { zipCode } = data;
  const isValid = /^\d{5}$/.test(zipCode ?? '');

  return (
    <div className="px-5 py-6 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-gray-900 mb-2">
          Where is the property?
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed">
          Rates can vary by area. Enter the property's ZIP code.
        </p>
      </div>

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2.5">
          ZIP Code
        </label>
        <div className="relative">
          <MapPin
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="e.g. 77001"
            value={zipCode ?? ''}
            onChange={e => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 5);
              onChange({ zipCode: val });
            }}
            onKeyDown={e => {
              if (e.key === 'Enter' && isValid) onNext();
            }}
            className="w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl text-gray-800 text-lg font-semibold placeholder:text-gray-300 placeholder:font-normal focus:outline-none focus:border-[#EA2523] transition-all bg-white"
          />
        </div>
      </div>

      <motion.button
        onClick={onNext}
        disabled={!isValid}
        whileHover={isValid ? { scale: 1.02 } : {}}
        whileTap={isValid ? { scale: 0.98 } : {}}
        className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors ${
          isValid
            ? 'bg-[#EA2523] text-white'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Continue
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
          <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.button>
    </div>
  );
}
