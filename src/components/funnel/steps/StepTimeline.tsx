import { motion } from 'framer-motion';
import { Zap, Calendar, Clock, Search } from 'lucide-react';
import { ChoiceCard } from '../../ui/ChoiceCard';
import type { FunnelData } from '../../../types/funnel';

interface StepTimelineProps {
  data: FunnelData;
  onSelect: (value: 'now' | '30-days' | '2-4-months' | 'researching') => void;
}

const options = [
  {
    icon: Zap,
    label: 'Ready Now',
    description: "I'm ready to move forward immediately",
    value: 'now' as const,
  },
  {
    icon: Calendar,
    label: 'Within 30 Days',
    description: "I'll be making a decision soon",
    value: '30-days' as const,
  },
  {
    icon: Clock,
    label: '2–4 Months',
    description: "I'm planning ahead for the near future",
    value: '2-4-months' as const,
  },
  {
    icon: Search,
    label: 'Just Researching',
    description: "I'm exploring options and learning",
    value: 'researching' as const,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepTimeline({ data, onSelect }: StepTimelineProps) {
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
            Step 4 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            When are you looking to close?
          </h1>
          <p className="text-gray-500 text-base">
            This helps us prioritize the right loan options for your timeline.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-3">
          {options.map(option => (
            <ChoiceCard
              key={option.value}
              icon={option.icon}
              label={option.label}
              description={option.description}
              selected={data.timeline === option.value}
              onClick={() => onSelect(option.value)}
              variant="list"
              chevron
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
