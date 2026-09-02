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
        if (i === STEPS.length - 1) {
          timers.push(setTimeout(onComplete, 600));
        }
      }, 800 + i * 800));
    });

    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-full w-full flex flex-col items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #233B86 0%, #1A2B63 100%)' }}
    >
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-12"
      >
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" fill="white"/>
          </svg>
        </div>
        <div>
          <p className="font-bold text-lg text-white leading-tight">Texas United</p>
          <p className="text-white/60 text-sm leading-tight">Mortgage</p>
        </div>
      </motion.div>

      {/* Main loader card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20"
      >
        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-white mb-2">
            Calculating your personalized rates{dots}
          </h2>
          <p className="text-white/60 text-sm">
            This usually takes just a few seconds
          </p>
        </div>

        {/* Animated spinner */}
        <div className="flex justify-center mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 border-4 border-white/20 border-t-white rounded-full"
          />
        </div>

        {/* Checklist */}
        <div className="space-y-3">
          {STEPS.map((step, i) => {
            const isComplete = completedSteps.includes(i);
            const isActive = completedSteps.length === i;

            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-3"
              >
                <div className="relative w-6 h-6 flex-shrink-0">
                  {isComplete ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                    >
                      <Check size={14} className="text-white" strokeWidth={3} />
                    </motion.div>
                  ) : (
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isActive ? 'border-white' : 'border-white/30'
                    }`}>
                      {isActive && (
                        <motion.div
                          animate={{ scale: [0.5, 1, 0.5] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="w-2 h-2 rounded-full bg-white"
                        />
                      )}
                    </div>
                  )}
                </div>
                <span
                  className={`text-sm font-medium transition-colors ${
                    isComplete ? 'text-green-400' : isActive ? 'text-white' : 'text-white/40'
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Bottom tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/40 text-xs mt-8 text-center"
      >
        No credit check required · Results are free
      </motion.p>
    </div>
  );
}
