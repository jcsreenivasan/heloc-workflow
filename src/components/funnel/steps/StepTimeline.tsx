import { motion } from 'framer-motion';
import { Zap, Calendar, Clock, Search } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepTimelineProps {
  data: FunnelData;
  onSelect: (value: 'now' | '30-days' | '2-4-months' | 'researching') => void;
}

const options = [
  { icon: Zap,      label: 'Ready Now',         desc: 'Ready to move forward immediately',     value: 'now' as const },
  { icon: Calendar, label: 'Within 30 Days',    desc: "I'll be making a decision soon",        value: '30-days' as const },
  { icon: Clock,    label: '2–4 Months',        desc: "I'm planning ahead for the near future", value: '2-4-months' as const },
  { icon: Search,   label: 'Just Researching',  desc: "I'm exploring and learning my options", value: 'researching' as const },
];

export function StepTimeline({ data, onSelect }: StepTimelineProps) {
  return (
    <div className="px-5 py-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1">When are you looking to close?</h2>
        <p className="text-sm text-gray-500">Helps us prioritize the right loan options for your timeline.</p>
      </div>

      <div className="flex flex-col gap-2.5">
        {options.map((opt, i) => {
          const selected = data.timeline === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={opt.value}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(opt.value)}
              whileHover={{ x: 3 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                selected
                  ? 'border-[#EA2523] bg-[#EA2523]/5'
                  : 'border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                selected ? 'bg-[#EA2523]/10' : 'bg-white'
              }`}>
                <Icon size={18} className={selected ? 'text-[#EA2523]' : 'text-[#233B86]'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${selected ? 'text-[#EA2523]' : 'text-gray-800'}`}>{opt.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 truncate">{opt.desc}</p>
              </div>
              <svg
                className={`w-4 h-4 flex-shrink-0 transition-colors ${selected ? 'text-[#EA2523]' : 'text-gray-300'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
