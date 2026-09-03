import { motion } from 'framer-motion';
import { Shield, UserX } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepMilitaryProps {
  data: FunnelData;
  onSelect: (value: boolean) => void;
}

const options = [
  {
    icon: Shield,
    label: 'Yes — Veteran or Active Duty',
    desc: 'I may qualify for VA loan benefits (lower rates, no PMI)',
    value: true,
  },
  {
    icon: UserX,
    label: 'No Military Service',
    desc: "I'll use conventional or FHA loan options",
    value: false,
  },
];

export function StepMilitary({ data, onSelect }: StepMilitaryProps) {
  return (
    <div className="px-5 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Have you served in the U.S. military?</h2>
        <p className="text-sm text-gray-500">Veterans may qualify for VA loans with no PMI and lower rates.</p>
      </div>

      <div className="flex flex-col gap-3">
        {options.map((opt, i) => {
          const selected = data.military === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={String(opt.value)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
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

      <p className="text-center text-xs text-gray-400 mt-4">
        No discharge documents required at this stage.
      </p>
    </div>
  );
}
