import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { FunnelData, UseOfFunds, EmploymentStatus } from '../../../types/funnel';

interface StepThreeProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const FUND_USES: { value: UseOfFunds; label: string; img?: string; icon?: string }[] = [
  { value: 'home-improvement',   label: 'Home Improvement',   img: '/home-improvement.png'   },
  { value: 'debt-consolidation', label: 'Debt Consolidation', img: '/debt-consolidation.png' },
  { value: 'major-purchase',     label: 'Major Purchase',     img: '/major-purchase.png'     },
  { value: 'emergency-fund',     label: 'Emergency Fund',     img: '/emergency-fund.png'     },
  { value: 'other',              label: 'Other',              icon: '•••'                    },
];

const EMPLOYMENT_STATUSES: { value: EmploymentStatus; label: string; sub: string; img?: string; icon?: string }[] = [
  { value: 'employed',      label: 'Employed',      sub: 'W-2 employee',          img: '/employed.png'      },
  { value: 'self-employed', label: 'Self-Employed',  sub: '1099 / business owner', img: '/self-employed.png' },
  { value: 'retired',       label: 'Retired',        sub: 'Fixed income',           img: '/retired.png'       },
  { value: 'other',         label: 'Other',           sub: 'Not listed above',       icon: '•••'              },
];

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function QLabel({ n }: { n: number }) {
  return (
    <span className="text-[10px] font-black tracking-widest shrink-0" style={{ color: '#757575' }}>
      Q{n}
    </span>
  );
}

function BorrowSlider({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const MIN = 10000, MAX = 350000, STEP = 5000;
  const pct = ((value - MIN) / (MAX - MIN)) * 100;
  return (
    <div className="bg-white border border-gray-200 rounded-xl px-4 py-3">
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#757575' }}>Borrow Amount</span>
        <span className="text-xl font-black text-[#1E3569]">{fmtCurrency(value)}</span>
      </div>
      <input
        type="range" min={MIN} max={MAX} step={STEP} value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="slider-input w-full"
        style={{ background: `linear-gradient(to right, #1E3569 ${pct}%, #E5E7EB ${pct}%)` }}
      />
      <div className="flex justify-between mt-2">
        <span className="text-xs" style={{ color: '#757575' }}>$10K</span>
        <span className="text-xs" style={{ color: '#757575' }}>$350K</span>
      </div>
    </div>
  );
}

export function StepThree({ data, onChange, onNext }: StepThreeProps) {
  const { borrowAmount, useOfFunds, employmentStatus } = data;
  const canContinue = useOfFunds !== null && employmentStatus !== null;

  return (
    <div className="px-5 py-5">

      {/* Q5: Use of funds */}
      <div className="pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={5} />
          <h2 className="text-base font-black text-gray-900">What do you plan to use the funds for?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {FUND_USES.map(fu => {
            const selected = useOfFunds === fu.value;
            return (
              <motion.button
                key={fu.value}
                onClick={() => onChange({ useOfFunds: fu.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                } ${fu.value === 'other' ? 'col-span-2' : ''}`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={9} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                {fu.img
                  ? <img src={fu.img} alt={fu.label} className="w-10 h-10 object-contain mb-1" />
                  : <span className="text-lg mb-1">{fu.icon}</span>
                }
                <span className="text-xs font-bold text-gray-800">{fu.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Q6: Borrow amount */}
      <div className="border-t-2 border-gray-100 pt-6 pb-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={6} />
          <h2 className="text-base font-black text-gray-900">How much are you looking to borrow?</h2>
        </div>
        <BorrowSlider value={borrowAmount ?? 75000} onChange={v => onChange({ borrowAmount: v })} />
      </div>

      {/* Q7: Employment status */}
      <div className="border-t-2 border-gray-100 pt-6">
        <div className="flex items-baseline gap-2 mb-3">
          <QLabel n={7} />
          <h2 className="text-base font-black text-gray-900">What's your employment status?</h2>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          {EMPLOYMENT_STATUSES.map(es => {
            const selected = employmentStatus === es.value;
            return (
              <motion.button
                key={es.value}
                onClick={() => onChange({ employmentStatus: es.value })}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative flex flex-col items-center text-center p-3 rounded-xl border-2 transition-all ${
                  selected
                    ? 'border-[#EA2523] bg-[#EA2523]/5 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-[#EA2523] rounded-full flex items-center justify-center"
                  >
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
                {es.img
                  ? <img src={es.img} alt={es.label} className="w-12 h-12 object-contain mb-1.5" />
                  : <span className="text-2xl mb-1.5">{es.icon}</span>
                }
                <p className="text-sm font-bold text-gray-900">{es.label}</p>
                <p className="text-xs mt-0.5" style={{ color: '#757575' }}>{es.sub}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Continue */}
      <AnimatePresence>
        {canContinue && (
          <motion.div key="continue" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-5">
            <motion.button
              onClick={onNext}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 bg-[#EA2523] text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2"
            >
              See My HELOC Options
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
