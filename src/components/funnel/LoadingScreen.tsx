import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Fetching your preferences...',
  'Analyzing your scenario...',
  'Finding your best rates...',
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [dots, setDots] = useState('');

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => {
        setCompletedSteps(prev => [...prev, i]);
        if (i === STEPS.length - 1) timers.push(setTimeout(onComplete, 500));
      }, 750 + i * 750));
    });
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const id = setInterval(() => setDots(p => p.length >= 3 ? '' : p + '.'), 400);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 bg-[#233B86]">
      {/* Spinner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full mb-8"
      />

      <h3 className="text-lg font-bold text-white mb-1 text-center">
        Calculating your rates{dots}
      </h3>
      <p className="text-white/50 text-sm mb-8 text-center">Just a moment</p>

      {/* Checklist */}
      <div className="w-full max-w-xs space-y-3.5">
        {STEPS.map((step, i) => {
          const done = completedSteps.includes(i);
          const active = completedSteps.length === i;
          return (
            <motion.div
              key={step}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 flex-shrink-0">
                {done ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                  >
                    <Check size={13} className="text-white" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    active ? 'border-white' : 'border-white/25'
                  }`}>
                    {active && (
                      <motion.div
                        animate={{ scale: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 0.9 }}
                        className="w-2 h-2 rounded-full bg-white"
                      />
                    )}
                  </div>
                )}
              </div>
              <span className={`text-sm font-medium ${done ? 'text-green-400' : active ? 'text-white' : 'text-white/35'}`}>
                {step}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
