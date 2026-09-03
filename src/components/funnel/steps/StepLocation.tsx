import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface Props { data: FunnelData; onChange: (u: Partial<FunnelData>) => void; onNext: () => void; }

export function StepLocation({ data, onChange, onNext }: Props) {
  const isValid = /^\d{5}$/.test(data.zip);

  return (
    <div>
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-emerald-50/70 to-white">
        <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
          <MapPin size={24} className="text-emerald-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">Where is the property?</h2>
        <p className="text-sm text-gray-500">Rates can vary by area. Enter the property's ZIP code.</p>
      </div>

      <div className="px-6 pb-8">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">ZIP Code</label>

          <div className="relative">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 77001"
              value={data.zip}
              maxLength={5}
              autoFocus
              onChange={e => onChange({ zip: e.target.value.replace(/\D/g, '') })}
              onKeyDown={e => { if (e.key === 'Enter' && isValid) onNext(); }}
              className={`w-full pl-11 pr-4 py-4 rounded-2xl border-2 text-gray-900 font-bold text-2xl tracking-widest focus:outline-none transition-all ${
                isValid
                  ? 'border-emerald-400 bg-emerald-50/50 focus:border-emerald-500'
                  : 'border-gray-200 focus:border-[#233B86]'
              }`}
            />
            {isValid && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
          </div>

          {data.zip.length > 0 && !isValid && (
            <p className="text-xs text-red-500 mt-2">Please enter a valid 5-digit ZIP code</p>
          )}

          <motion.button
            onClick={onNext}
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.97 } : {}}
            className={`w-full mt-6 py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
              isValid
                ? 'bg-[#EA2523] text-white shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C]'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            Continue <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
