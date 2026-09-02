import { motion } from 'framer-motion';
import { ChevronRight, TrendingDown } from 'lucide-react';
import { SliderInput } from '../../ui/SliderInput';
import type { FunnelData } from '../../../types/funnel';
import { getLTVStatus } from '../../../utils/rateCalculator';

interface StepFinancialsProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatCurrencyFull(value: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepFinancials({ data, onChange, onNext }: StepFinancialsProps) {
  const maxDown = Math.round(data.propertyValue * 0.95 / 1000) * 1000;
  const cappedDown = Math.min(data.downPayment, maxDown);
  const loanAmount = data.propertyValue - cappedDown;
  const ltv = (loanAmount / data.propertyValue) * 100;
  const downPct = ((cappedDown / data.propertyValue) * 100).toFixed(1);
  const ltvStatus = getLTVStatus(ltv);

  const handlePropertyValueChange = (val: number) => {
    const newMax = Math.round(val * 0.95 / 1000) * 1000;
    onChange({
      propertyValue: val,
      downPayment: Math.min(data.downPayment, newMax),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-lg"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white" style={{ backgroundColor: '#EA2523' }}>
            Step 6 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            Property value & down payment
          </h1>
          <p className="text-gray-500 text-base">
            These numbers directly affect your rate and monthly payment.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-8">
          {/* LTV Badge */}
          <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: ltvStatus.color + '40', backgroundColor: ltvStatus.color + '10' }}>
            <div className="flex items-center gap-2">
              <TrendingDown size={18} style={{ color: ltvStatus.color }} />
              <span className="text-sm font-semibold" style={{ color: ltvStatus.color }}>
                LTV: {ltv.toFixed(0)}%
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: ltvStatus.color }}>
                {ltvStatus.label}
              </span>
              <span>Loan: {formatCurrencyFull(loanAmount)}</span>
            </div>
          </div>

          {/* Property Value */}
          <SliderInput
            label="Estimated Property Value"
            sublabel={formatCurrencyFull(data.propertyValue)}
            value={data.propertyValue}
            min={100000}
            max={2000000}
            step={5000}
            onChange={handlePropertyValueChange}
            formatValue={formatCurrency}
            color="#233B86"
          />

          {/* Down Payment */}
          <SliderInput
            label={`Down Payment (${downPct}%)`}
            sublabel={formatCurrencyFull(cappedDown)}
            value={cappedDown}
            min={0}
            max={maxDown}
            step={1000}
            onChange={val => onChange({ downPayment: val })}
            formatValue={formatCurrency}
            color="#EA2523"
          />

          <motion.button
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all"
            style={{ backgroundColor: '#EA2523' }}
          >
            Continue
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
