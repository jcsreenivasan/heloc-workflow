import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { TrustBar } from '../ui/TrustBar';
import type { FunnelStep } from '../../types/funnel';

interface FunnelLayoutProps {
  children: React.ReactNode;
  currentStep: FunnelStep;
  currentQuestionIndex: number;
  isQuestionStep: boolean;
  canGoBack: boolean;
  onBack: () => void;
  direction: 'forward' | 'backward';
  progress?: number;
}

const slideVariants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? -60 : 60,
    opacity: 0,
  }),
};

export function FunnelLayout({
  children,
  currentStep,
  currentQuestionIndex,
  isQuestionStep,
  canGoBack,
  onBack,
  direction,
  progress: _progress,
}: FunnelLayoutProps) {
  const showProgress = isQuestionStep;
  const showHeader = currentStep !== 'loading' && currentStep !== 'rates';

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col" style={{
      background: 'linear-gradient(135deg, #EEF1FB 0%, #F9FAFB 40%, #FFF5F5 100%)',
    }}>
      {/* Header */}
      {showHeader && (
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-100 z-20">
          {/* Back button */}
          <div className="w-28 flex items-center">
            <AnimatePresence>
              {canGoBack && (
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  onClick={onBack}
                  className="flex items-center gap-2 text-gray-500 hover:text-secondary transition-colors font-medium text-sm group"
                >
                  <ArrowLeft size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                  <span className="hidden sm:inline">Back</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#233B86' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight" style={{ color: '#233B86' }}>Texas United</p>
              <p className="text-xs text-gray-400 leading-tight">Mortgage</p>
            </div>
          </div>

          {/* Progress */}
          <div className="w-28 flex justify-end">
            {showProgress && (
              <ProgressBar currentIndex={currentQuestionIndex} />
            )}
          </div>
        </header>
      )}

      {/* Full-screen header for rates */}
      {currentStep === 'rates' && (
        <header className="flex-shrink-0 flex items-center justify-between px-4 sm:px-8 py-4 bg-secondary z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" fill="white"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-sm leading-tight text-white">Texas United</p>
              <p className="text-xs text-white/60 leading-tight">Mortgage</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-white/80 text-sm font-medium">Live Rates</span>
          </div>
          <a
            href="tel:+18005551234"
            className="text-white/80 hover:text-white text-sm font-medium transition-colors"
          >
            (800) 555-1234
          </a>
        </header>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
            className="absolute inset-0 overflow-y-auto no-scrollbar"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Trust bar */}
      {currentStep !== 'loading' && currentStep !== 'rates' && (
        <div className="flex-shrink-0 z-10">
          <TrustBar />
        </div>
      )}
    </div>
  );
}
