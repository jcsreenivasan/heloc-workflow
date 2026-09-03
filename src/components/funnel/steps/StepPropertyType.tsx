import { motion } from 'framer-motion';
import { House, Building2, Building, Layers } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepPropertyTypeProps {
  data: FunnelData;
  onSelect: (value: 'single-family' | 'townhome' | 'condo' | 'multi-unit') => void;
}

const options = [
  { icon: House,     label: 'Single Family',  desc: 'Detached home',        value: 'single-family' as const },
  { icon: Building2, label: 'Townhome',        desc: 'Attached multi-floor', value: 'townhome' as const },
  { icon: Building,  label: 'Condo',           desc: 'Unit in a building',   value: 'condo' as const },
  { icon: Layers,    label: 'Multi-Unit',      desc: '2–4 unit property',    value: 'multi-unit' as const },
];

export function StepPropertyType({ data, onSelect }: StepPropertyTypeProps) {
  return (
    <div className="px-5 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">What type of property?</h2>
        <p className="text-sm text-gray-500">Property type can affect your rate and loan options.</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {options.map((opt, i) => {
          const selected = data.propertyType === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(opt.value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-center gap-2.5 p-5 rounded-xl border-2 text-center transition-all cursor-pointer ${
                selected
                  ? 'border-[#EA2523] bg-[#EA2523]/5'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }`}
            >
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                selected ? 'bg-[#EA2523]/10' : 'bg-white'
              }`}>
                <Icon size={22} className={selected ? 'text-[#EA2523]' : 'text-[#233B86]'} />
              </div>
              <div>
                <p className={`text-sm font-semibold ${selected ? 'text-[#EA2523]' : 'text-gray-800'}`}>{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
