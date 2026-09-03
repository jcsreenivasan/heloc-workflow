import { motion } from 'framer-motion';
import { MapPin, Palmtree, Key } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepResidencyTypeProps {
  data: FunnelData;
  onSelect: (value: 'primary' | 'second-home' | 'rental') => void;
}

const options = [
  { icon: MapPin,    label: 'Primary Home',        desc: 'My main residence',        value: 'primary' as const },
  { icon: Palmtree,  label: 'Second Home',          desc: 'Vacation or seasonal',     value: 'second-home' as const },
  { icon: Key,       label: 'Investment / Rental',  desc: 'Generate rental income',   value: 'rental' as const },
];

export function StepResidencyType({ data, onSelect }: StepResidencyTypeProps) {
  return (
    <div className="px-5 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">How will you use this property?</h2>
        <p className="text-sm text-gray-500">Occupancy affects your rate and down payment requirements.</p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const selected = data.residencyType === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              onClick={() => onSelect(opt.value)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                selected
                  ? 'border-[#EA2523] bg-[#EA2523]/5'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }`}
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected ? 'bg-[#EA2523]/10' : 'bg-white'
              }`}>
                <Icon size={20} className={selected ? 'text-[#EA2523]' : 'text-[#233B86]'} />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${selected ? 'text-[#EA2523]' : 'text-gray-800'}`}>{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>
              {selected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center flex-shrink-0"
                >
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
