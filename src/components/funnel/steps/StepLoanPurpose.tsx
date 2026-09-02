import { motion } from 'framer-motion';
import { Home, RefreshCw } from 'lucide-react';
import { ChoiceCard } from '../../ui/ChoiceCard';
import type { FunnelData } from '../../../types/funnel';

interface StepLoanPurposeProps {
  data: FunnelData;
  onSelect: (value: 'purchase' | 'refinance') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepLoanPurpose({ data, onSelect }: StepLoanPurposeProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-2xl"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white" style={{ backgroundColor: '#EA2523' }}>
            Step 1 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            What's your loan goal?
          </h1>
          <p className="text-gray-500 text-base">
            Tell us what you're looking to do and we'll find the best rates for you.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChoiceCard
            icon={Home}
            label="Purchase a Home"
            description="I'm buying a new property"
            selected={data.loanPurpose === 'purchase'}
            onClick={() => onSelect('purchase')}
            variant="tall"
          />
          <ChoiceCard
            icon={RefreshCw}
            label="Refinance"
            description="I want to refinance my current mortgage"
            selected={data.loanPurpose === 'refinance'}
            onClick={() => onSelect('refinance')}
            variant="tall"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
