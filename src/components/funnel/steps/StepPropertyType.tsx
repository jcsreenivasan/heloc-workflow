import { motion } from 'framer-motion';
import { House, Building2, Building, Layers } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface Props { data: FunnelData; onSelect: (v: 'single-family'|'townhome'|'condo'|'multi-unit') => void; }

const options = [
  { icon: House,     label: 'Single Family', desc: 'Stand-alone, detached home',   value: 'single-family' as const, color: '#6366F1', bg: '#EEF2FF' },
  { icon: Building2, label: 'Townhome',       desc: 'Attached, multi-floor unit',  value: 'townhome'      as const, color: '#0D9488', bg: '#F0FDFA' },
  { icon: Building,  label: 'Condo',          desc: 'Unit within a building',      value: 'condo'         as const, color: '#F59E0B', bg: '#FFFBEB' },
  { icon: Layers,    label: 'Multi-Unit',     desc: '2–4 unit investment property',value: 'multi-unit'    as const, color: '#EC4899', bg: '#FDF2F8' },
];

const SEL = '#EA2523';

export function StepPropertyType({ data, onSelect }: Props) {
  return (
    <div>
      {/* Step hero band */}
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-indigo-50/70 to-white">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">
          <House size={24} className="text-indigo-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">What type of property?</h2>
        <p className="text-sm text-gray-500">This helps us match you with the right loan program.</p>
      </div>

      <div className="px-6 pb-7">
        <div className="grid grid-cols-2 gap-3">
          {options.map((opt, i) => {
            const selected = data.propertyType === opt.value;
            const Icon = opt.icon;
            return (
              <motion.button
                key={opt.value}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
                onClick={() => onSelect(opt.value)}
                whileHover={{ y: -2, boxShadow: `0 8px 24px ${opt.color}22` }}
                whileTap={{ scale: 0.96 }}
                className={`relative flex flex-col items-start gap-3 p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                  selected
                    ? 'border-[#EA2523] shadow-lg'
                    : 'border-gray-100 bg-white hover:border-gray-200'
                }`}
                style={selected ? { backgroundColor: `${SEL}08`, boxShadow: `0 0 0 3px ${SEL}22` } : {}}
              >
                {/* Check badge */}
                {selected && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-3 right-3 w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center shadow-sm"
                  >
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}

                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: selected ? `${SEL}18` : opt.bg }}
                >
                  <Icon size={22} style={{ color: selected ? SEL : opt.color }} />
                </div>

                <div>
                  <p className="text-sm font-bold leading-tight" style={{ color: selected ? SEL : '#111827' }}>{opt.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-snug">{opt.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
