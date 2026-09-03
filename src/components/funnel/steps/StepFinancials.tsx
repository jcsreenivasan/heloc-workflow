import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { SliderInput } from '../../ui/SliderInput';
import type { FunnelData } from '../../../types/funnel';
import { getLTVStatus } from '../../../utils/rateCalculator';

interface StepFinancialsProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

function fmt(v: number): string {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  return `$${(v / 1000).toFixed(0)}K`;
}

function fmtFull(v: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(v);
}

export function StepFinancials({ data, onChange, onNext }: StepFinancialsProps) {
  const maxDown = Math.round(data.propertyValue * 0.95 / 1000) * 1000;
  const cappedDown = Math.min(data.downPayment, maxDown);
  const loanAmount = data.propertyValue - cappedDown;
  const ltv = (loanAmount / data.propertyValue) * 100;
  const downPct = ((cappedDown / data.propertyValue) * 100).toFixed(1);
  const ltvStatus = getLTVStatus(ltv);

  const handlePropertyValueChange = (val: number) => {
    const newMax = Math.round(val * 0.95 / 1000) * 1000;
    onChange({ propertyValue: val, downPayment: Math.min(data.downPayment, newMax) });
  };

  return (
    <div className="px-5 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-5">
          <h2 className="text-xl font-bold text-gray-900 mb-1">Property value & down payment</h2>
          <p className="text-sm text-gray-500">These figures directly affect your rate and monthly payment.</p>
        </div>

        {/* LTV badge */}
        <div
          className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-6 border"
          style={{ borderColor: `${ltvStatus.color}30`, backgroundColor: `${ltvStatus.color}0D` }}
        >
          <span className="text-xs font-semibold" style={{ color: ltvStatus.color }}>
            LTV {ltv.toFixed(0)}% — {ltvStatus.label}
          </span>
          <span className="text-xs text-gray-500 font-medium">Loan: {fmtFull(loanAmount)}</span>
        </div>

        <div className="space-y-8">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-semibold text-gray-700">Property Value</span>
              <span className="text-base font-bold text-[#233B86]">{fmtFull(data.propertyValue)}</span>
            </div>
            <SliderInput
              value={data.propertyValue}
              min={100000}
              max={2000000}
              step={5000}
              onChange={handlePropertyValueChange}
              formatValue={fmt}
              color="#233B86"
            />
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-semibold text-gray-700">Down Payment ({downPct}%)</span>
              <span className="text-base font-bold text-[#EA2523]">{fmtFull(cappedDown)}</span>
            </div>
            <SliderInput
              value={cappedDown}
              min={0}
              max={maxDown}
              step={1000}
              onChange={val => onChange({ downPayment: val })}
              formatValue={fmt}
              color="#EA2523"
            />
          </div>
        </div>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-8 py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-[#EA2523] shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C] transition-colors"
        >
          Continue <ChevronRight size={18} />
        </motion.button>
      </motion.div>
    </div>
  );
}
