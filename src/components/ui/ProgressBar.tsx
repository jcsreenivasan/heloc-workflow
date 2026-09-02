import { motion } from 'framer-motion';
import { QUESTION_STEPS } from '../../types/funnel';

interface ProgressBarProps {
  currentIndex: number;
  totalSteps?: number;
}

export function ProgressBar({ currentIndex, totalSteps = QUESTION_STEPS.length }: ProgressBarProps) {
  const progress = ((currentIndex + 1) / totalSteps) * 100;

  return (
    <div className="w-full max-w-xs">
      {/* Step dots */}
      <div className="flex items-center gap-1 mb-1.5 justify-center">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: i <= currentIndex ? '#EA2523' : '#E5E7EB',
              width: i === currentIndex ? 20 : 8,
            }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="h-2 rounded-full"
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: '#EA2523' }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      <p className="text-xs text-gray-400 text-center mt-1.5">
        Step {currentIndex + 1} of {totalSteps}
      </p>
    </div>
  );
}
