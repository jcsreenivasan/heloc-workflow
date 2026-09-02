import { motion } from 'framer-motion';
import { MapPin, Palmtree, Key } from 'lucide-react';
import { ChoiceCard } from '../../ui/ChoiceCard';
import type { FunnelData } from '../../../types/funnel';

interface StepResidencyTypeProps {
  data: FunnelData;
  onSelect: (value: 'primary' | 'second-home' | 'rental') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepResidencyType({ data, onSelect }: StepResidencyTypeProps) {
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
            Step 3 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            How will you use this property?
          </h1>
          <p className="text-gray-500 text-base">
            Occupancy type affects your interest rate and loan requirements.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ChoiceCard
            icon={MapPin}
            label="Primary Home"
            description="My main residence"
            selected={data.residencyType === 'primary'}
            onClick={() => onSelect('primary')}
          />
          <ChoiceCard
            icon={Palmtree}
            label="Second Home"
            description="Vacation or seasonal"
            selected={data.residencyType === 'second-home'}
            onClick={() => onSelect('second-home')}
          />
          <ChoiceCard
            icon={Key}
            label="Investment / Rental"
            description="Generate rental income"
            selected={data.residencyType === 'rental'}
            onClick={() => onSelect('rental')}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
