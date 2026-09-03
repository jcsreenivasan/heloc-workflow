import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepLocationProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

export function StepLocation({ data, onChange, onNext }: StepLocationProps) {
  const isValid = data.zip.length === 5 && /^\d{5}$/.test(data.zip);

  return (
    <div className="px-5 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Where is the property?</h2>
          <p className="text-sm text-gray-500">Rates vary by location. Enter the property's ZIP code.</p>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">ZIP Code</label>
            <div className="relative">
              <MapPin size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 77001"
                value={data.zip}
                maxLength={5}
                autoFocus
                onChange={e => {
                  const v = e.target.value.replace(/\D/g, '');
                  onChange({ zip: v });
                }}
                onKeyDown={e => { if (e.key === 'Enter' && isValid) onNext(); }}
                className="w-full pl-10 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-800 font-medium text-lg focus:border-[#233B86] focus:outline-none transition-colors"
              />
            </div>
            {data.zip.length > 0 && !isValid && (
              <p className="text-xs text-red-500 mt-1.5">Please enter a valid 5-digit ZIP code</p>
            )}
          </div>

          <motion.button
            onClick={onNext}
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all text-sm ${
              isValid
                ? 'bg-[#EA2523] shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C]'
                : 'bg-gray-200 cursor-not-allowed text-gray-400'
            }`}
          >
            Continue
            <ChevronRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
