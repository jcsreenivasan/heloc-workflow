import { motion } from 'framer-motion';
import { MapPin, Palmtree, Key } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface Props { data: FunnelData; onSelect: (v: 'primary'|'second-home'|'rental') => void; }

const options = [
  {
    icon: MapPin,
    label: 'Primary Home',
    desc: 'My main, full-time residence',
    value: 'primary' as const,
    color: '#0D9488',
    bg: '#F0FDFA',
    tag: 'Best rates',
    tagColor: '#0D9488',
  },
  {
    icon: Palmtree,
    label: 'Second Home',
    desc: 'Vacation or seasonal property',
    value: 'second-home' as const,
    color: '#F59E0B',
    bg: '#FFFBEB',
    tag: null,
    tagColor: '',
  },
  {
    icon: Key,
    label: 'Investment / Rental',
    desc: 'Property to generate rental income',
    value: 'rental' as const,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    tag: 'Higher rates apply',
    tagColor: '#8B5CF6',
  },
];

const SEL = '#EA2523';

export function StepResidencyType({ data, onSelect }: Props) {
  return (
    <div>
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-teal-50/70 to-white">
        <div className="w-12 h-12 rounded-2xl bg-teal-100 flex items-center justify-center mb-4">
          <MapPin size={24} className="text-teal-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">How will you use this property?</h2>
        <p className="text-sm text-gray-500">Occupancy type affects your rate and down payment requirements.</p>
      </div>

      <div className="px-6 pb-7 flex flex-col gap-3">
        {options.map((opt, i) => {
          const selected = data.residencyType === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 300, damping: 28 }}
              onClick={() => onSelect(opt.value)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                selected ? 'border-[#EA2523]' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
              style={selected ? { backgroundColor: `${SEL}07`, boxShadow: `0 0 0 3px ${SEL}18` } : {}}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: selected ? `${SEL}15` : opt.bg }}
              >
                <Icon size={22} style={{ color: selected ? SEL : opt.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-bold" style={{ color: selected ? SEL : '#111827' }}>{opt.label}</p>
                  {opt.tag && !selected && (
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${opt.tagColor}15`, color: opt.tagColor }}
                    >
                      {opt.tag}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>

              <div className="flex-shrink-0">
                {selected ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-6 h-6 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : (
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
