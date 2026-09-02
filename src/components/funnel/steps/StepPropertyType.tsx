import { motion } from 'framer-motion';
import { House, Building2, Building, Layers } from 'lucide-react';
import { ChoiceCard } from '../../ui/ChoiceCard';
import type { FunnelData } from '../../../types/funnel';

interface StepPropertyTypeProps {
  data: FunnelData;
  onSelect: (value: 'single-family' | 'townhome' | 'condo' | 'multi-unit') => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepPropertyType({ data, onSelect }: StepPropertyTypeProps) {
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
            Step 2 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            What type of property?
          </h1>
          <p className="text-gray-500 text-base">
            Different property types can affect your mortgage rate and terms.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <ChoiceCard
            icon={House}
            label="Single Family"
            description="Detached home"
            selected={data.propertyType === 'single-family'}
            onClick={() => onSelect('single-family')}
          />
          <ChoiceCard
            icon={Building2}
            label="Townhome"
            description="Attached multi-floor"
            selected={data.propertyType === 'townhome'}
            onClick={() => onSelect('townhome')}
          />
          <ChoiceCard
            icon={Building}
            label="Condo"
            description="Unit in a building"
            selected={data.propertyType === 'condo'}
            onClick={() => onSelect('condo')}
          />
          <ChoiceCard
            icon={Layers}
            label="Multi-Unit"
            description="2–4 unit property"
            selected={data.propertyType === 'multi-unit'}
            onClick={() => onSelect('multi-unit')}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
