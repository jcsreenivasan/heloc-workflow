import { motion } from 'framer-motion';
import { Shield, UserX } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface Props { data: FunnelData; onSelect: (v: boolean) => void; }

const SEL = '#EA2523';

export function StepMilitary({ data, onSelect }: Props) {
  return (
    <div>
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-slate-50/80 to-white">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
          <Shield size={24} className="text-blue-700" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">Have you served in the U.S. military?</h2>
        <p className="text-sm text-gray-500">Veterans may qualify for VA loans — lower rates and no PMI required.</p>
      </div>

      <div className="px-6 pb-8 space-y-3">
        {/* YES */}
        {[
          {
            icon: Shield,
            label: 'Yes — Veteran or Active Duty',
            desc: 'I may be eligible for VA loan benefits',
            value: true,
            accentColor: '#1D4ED8',
            accentBg: '#EFF6FF',
            badge: 'VA Loan Eligible',
            badgeBg: '#DBEAFE',
            badgeText: '#1D4ED8',
          },
          {
            icon: UserX,
            label: 'No Military Service',
            desc: "I'll use conventional or FHA loan options",
            value: false,
            accentColor: '#6B7280',
            accentBg: '#F9FAFB',
            badge: null,
            badgeBg: '',
            badgeText: '',
          },
        ].map((opt, i) => {
          const selected = data.military === opt.value;
          const Icon = opt.icon;
          return (
            <motion.button
              key={String(opt.value)}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 28 }}
              onClick={() => onSelect(opt.value)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                selected ? 'border-[#EA2523]' : 'border-gray-100 bg-white hover:border-gray-200'
              }`}
              style={selected ? { backgroundColor: `${SEL}07`, boxShadow: `0 0 0 3px ${SEL}18` } : {}}
            >
              <div
                className="w-13 h-13 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: selected ? `${SEL}15` : opt.accentBg }}
              >
                <Icon size={22} style={{ color: selected ? SEL : opt.accentColor }} />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <p className="text-sm font-bold" style={{ color: selected ? SEL : '#111827' }}>{opt.label}</p>
                  {opt.badge && !selected && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: opt.badgeBg, color: opt.badgeText }}>
                      {opt.badge}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{opt.desc}</p>
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

        <p className="text-center text-xs text-gray-400 pt-1">
          No discharge documents needed at this stage.
        </p>
      </div>
    </div>
  );
}
