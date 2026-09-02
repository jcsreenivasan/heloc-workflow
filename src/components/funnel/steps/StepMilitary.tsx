import { motion } from 'framer-motion';
import { Shield, UserX } from 'lucide-react';
import { ChoiceCard } from '../../ui/ChoiceCard';
import type { FunnelData } from '../../../types/funnel';

interface StepMilitaryProps {
  data: FunnelData;
  onSelect: (value: boolean) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepMilitary({ data, onSelect }: StepMilitaryProps) {
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
            Step 8 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            Have you served in the U.S. military?
          </h1>
          <p className="text-gray-500 text-base">
            Veterans may qualify for VA loans with lower rates and no PMI.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ChoiceCard
            icon={Shield}
            label="Yes, I'm a Veteran or Active Duty"
            description="I may qualify for VA loan benefits"
            selected={data.military === true}
            onClick={() => onSelect(true)}
            variant="tall"
          />
          <ChoiceCard
            icon={UserX}
            label="No Military Service"
            description="I'll explore conventional loan options"
            selected={data.military === false}
            onClick={() => onSelect(false)}
            variant="tall"
          />
        </motion.div>

        <motion.p variants={itemVariants} className="text-center text-xs text-gray-400 mt-4">
          This information helps us find VA-eligible loan products. No discharge paperwork required.
        </motion.p>
      </motion.div>
    </div>
  );
}
