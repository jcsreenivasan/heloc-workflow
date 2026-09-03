import { motion } from 'framer-motion';
import { Zap, Calendar, Clock, Search } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface Props { data: FunnelData; onSelect: (v: 'now'|'30-days'|'2-4-months'|'researching') => void; }

const options = [
  { icon: Zap,      label: 'Ready Now',        desc: 'I want to move forward immediately', value: 'now'          as const, color: '#EA2523', bg: '#FEF2F2' },
  { icon: Calendar, label: 'Within 30 Days',   desc: "I'll be deciding very soon",          value: '30-days'      as const, color: '#F59E0B', bg: '#FFFBEB' },
  { icon: Clock,    label: '2–4 Months',       desc: "I'm planning ahead for near future",  value: '2-4-months'   as const, color: '#0D9488', bg: '#F0FDFA' },
  { icon: Search,   label: 'Just Researching', desc: "I'm exploring options and learning",  value: 'researching'  as const, color: '#6366F1', bg: '#EEF2FF' },
];

const SEL = '#EA2523';

export function StepTimeline({ data, onSelect }: Props) {
  return (
    <div>
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-amber-50/70 to-white">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
          <Calendar size={24} className="text-amber-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">When are you looking to close?</h2>
        <p className="text-sm text-gray-500">We'll tailor recommendations to your timeline.</p>
      </div>

      <div className="px-6 pb-7 flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const selected = data.timeline === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, type: 'spring', stiffness: 300, damping: 28 }}
              onClick={() => onSelect(opt.value)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                selected ? 'border-[#EA2523]' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
              style={selected ? { backgroundColor: `${SEL}07`, boxShadow: `0 0 0 3px ${SEL}18` } : {}}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: selected ? `${SEL}15` : opt.bg }}
              >
                <Icon size={20} style={{ color: selected ? SEL : opt.color }} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold" style={{ color: selected ? SEL : '#111827' }}>{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{opt.desc}</p>
              </div>

              <div className="flex-shrink-0">
                {selected ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-[#EA2523] rounded-full flex items-center justify-center">
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
