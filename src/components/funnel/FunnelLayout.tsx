import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import type { FunnelStep } from '../../types/funnel';

interface FunnelLayoutProps {
  children: React.ReactNode;
  currentStep: FunnelStep;
  currentQuestionIndex: number;
  isQuestionStep: boolean;
  totalQuestions: number;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  direction: 'forward' | 'backward';
}

const slideVariants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? 48 : -48,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? -48 : 48,
    opacity: 0,
  }),
};

// Step labels for header
const STEP_LABELS: Partial<Record<FunnelStep, string>> = {
  'property-type': 'Property Type',
  'residency-type': 'Occupancy',
  'timeline': 'Timeline',
  'location': 'Location',
  'financials': 'Financials',
  'credit-score': 'Credit Score',
  'military': 'VA Eligibility',
  'lead-capture': 'Almost Done',
};

export function FunnelLayout({
  children,
  currentStep,
  currentQuestionIndex,
  isQuestionStep,
  totalQuestions,
  canGoBack,
  onBack,
  onClose,
  direction,
}: FunnelLayoutProps) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isLoading = currentStep === 'loading';
  const isRates = currentStep === 'rates';
  const showTopBar = !isLoading;

  return (
    /* Backdrop */
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Dark overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={isLoading ? undefined : onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        className={`relative w-full flex flex-col bg-white shadow-2xl overflow-hidden z-10 ${
          isRates
            ? 'max-w-4xl rounded-2xl'
            : 'max-w-lg rounded-2xl'
        }`}
        style={{ maxHeight: 'min(90vh, 780px)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        {showTopBar && (
          <div className={`flex-shrink-0 ${isRates ? 'bg-[#233B86]' : 'bg-white border-b border-gray-100'}`}>
            <div className="flex items-center justify-between px-5 py-4">
              {/* Left: back or logo */}
              <div className="w-8">
                <AnimatePresence>
                  {canGoBack && !isRates ? (
                    <motion.button
                      key="back"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      onClick={onBack}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-[#233B86] hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft size={18} />
                    </motion.button>
                  ) : isRates ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#EA2523] animate-pulse" />
                      <span className="text-white/70 text-xs font-medium">Live Rates</span>
                    </div>
                  ) : null}
                </AnimatePresence>
              </div>

              {/* Center: logo or step label */}
              <div className="flex-1 text-center">
                {isRates ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" fill="white"/>
                    </svg>
                    <span className="text-white font-bold text-sm">Texas United Mortgage</span>
                  </div>
                ) : isQuestionStep ? (
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {STEP_LABELS[currentStep] || ''}
                  </span>
                ) : (
                  <div className="flex items-center justify-center gap-1.5">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#233B86' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" fill="white"/>
                      </svg>
                    </div>
                    <span className="font-bold text-sm text-gray-700">Texas United</span>
                  </div>
                )}
              </div>

              {/* Right: close */}
              <div className="w-8 flex justify-end">
                {!isLoading && (
                  <button
                    onClick={onClose}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${
                      isRates
                        ? 'text-white/50 hover:text-white hover:bg-white/10'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>

            {/* Progress bar (question steps only) */}
            {isQuestionStep && (
              <div className="px-5 pb-4">
                {/* Step dots */}
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        backgroundColor: i < currentQuestionIndex
                          ? '#233B86'
                          : i === currentQuestionIndex
                          ? '#EA2523'
                          : '#E5E7EB',
                        width: i === currentQuestionIndex ? 24 : 8,
                      }}
                      transition={{ duration: 0.25 }}
                      className="h-1.5 rounded-full"
                    />
                  ))}
                  <span className="ml-auto text-xs text-gray-400 tabular-nums">
                    {currentQuestionIndex + 1}/{totalQuestions}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 340, damping: 34 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Trust footer (only on question + lead steps) */}
        {(isQuestionStep || currentStep === 'lead-capture') && (
          <div className="flex-shrink-0 border-t border-gray-50 bg-gray-50/80 px-5 py-2.5">
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Google 4.9
              </span>
              <span className="text-gray-200">·</span>
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Zillow 5.0
              </span>
              <span className="text-gray-200">·</span>
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                Yelp 4.7
              </span>
              <span className="text-gray-200">·</span>
              <span>No credit pull · Free</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
