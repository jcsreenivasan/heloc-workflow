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
  enter: (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? 56 : -56, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: 'forward' | 'backward') => ({ x: dir === 'forward' ? -56 : 56, opacity: 0 }),
};

const STEP_LABELS: Partial<Record<FunnelStep, string>> = {
  'step1':        'Your Property',
  'step2':        'Financial Profile',
  'step3':        'Loan Details',
  'step4':        'Your Location',
  'lead-capture': 'Almost There',
  'disqualified': 'Not Eligible',
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
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const isLoading = currentStep === 'loading';
  const isRates   = currentStep === 'rates';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-6">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={isLoading ? undefined : onClose}
        className="absolute inset-0 bg-black/55 backdrop-blur-[3px]"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`relative z-10 w-full flex flex-col bg-white overflow-hidden
          shadow-[0_32px_80px_rgba(0,0,0,0.28)]
          rounded-t-3xl sm:rounded-2xl
          ${isRates ? 'sm:max-w-3xl' : 'sm:max-w-[620px]'}
        `}
        style={{ maxHeight: 'min(93vh, 860px)' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── TOP CHROME ───────────────────────────────────── */}
        {!isLoading && (
          <div className={`flex-shrink-0 ${isRates ? 'bg-[#1A2B63]' : 'bg-white'}`}>
            {/* Drag handle (mobile) */}
            {!isRates && (
              <div className="flex justify-center pt-3 pb-1 sm:hidden">
                <div className="w-10 h-1 rounded-full bg-gray-200" />
              </div>
            )}

            {/* Header row */}
            <div className="flex items-center px-5 py-3.5 gap-3">
              {/* Left */}
              <div className="w-9 flex-shrink-0">
                <AnimatePresence mode="wait">
                  {canGoBack && !isRates ? (
                    <motion.button
                      key="back"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -8 }}
                      onClick={onBack}
                      className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition-colors"
                    >
                      <ArrowLeft size={17} />
                    </motion.button>
                  ) : isRates ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5">
                      <span className="relative flex w-2 h-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EA2523] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#EA2523]" />
                      </span>
                      <span className="text-white/70 text-xs font-semibold tracking-wide">LIVE</span>
                    </motion.div>
                  ) : (
                    <div className="w-9" />
                  )}
                </AnimatePresence>
              </div>

              {/* Center — logo */}
              <div className="flex-1 flex items-center justify-center gap-2.5 min-w-0">
                <img
                  src="/texas-united-logo.webp"
                  alt="Texas United Mortgage"
                  className="h-7 w-auto object-contain flex-shrink-0"
                  style={isRates ? { filter: 'brightness(0) invert(1)' } : {}}
                />
                {isQuestionStep && (
                  <>
                    <span className="text-gray-200 text-sm hidden sm:inline">|</span>
                    <span className="text-gray-400 text-sm font-medium hidden sm:inline truncate">
                      {STEP_LABELS[currentStep]}
                    </span>
                  </>
                )}
              </div>

              {/* Right — close */}
              <div className="w-9 flex-shrink-0 flex justify-end">
                {!isLoading && (
                  <button
                    onClick={onClose}
                    className={`w-9 h-9 flex items-center justify-center rounded-xl transition-colors ${
                      isRates
                        ? 'text-white/50 hover:text-white hover:bg-white/10'
                        : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <X size={17} />
                  </button>
                )}
              </div>
            </div>

            {/* Progress track — only on question steps */}
            {isQuestionStep && (
              <div className="px-5 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                    {STEP_LABELS[currentStep]}
                  </span>
                  <span className="text-xs font-bold text-[#EA2523] tabular-nums">
                    Step {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                </div>
                {/* Segmented bar */}
                <div className="flex gap-1.5">
                  {Array.from({ length: totalQuestions }).map((_, i) => (
                    <div key={i} className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: i <= currentQuestionIndex ? '100%' : '0%',
                          backgroundColor: '#EA2523',
                        }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Divider */}
            {!isRates && <div className="h-px bg-gray-100" />}
          </div>
        )}

        {/* ── CONTENT ──────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: 'spring', stiffness: 340, damping: 32 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── TRUST FOOTER ─────────────────────────────────── */}
        {(isQuestionStep || currentStep === 'lead-capture') && (
          <div className="flex-shrink-0 bg-gray-50 border-t border-gray-100 px-5 py-3">
            <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
              {[
                { label: 'Google', score: '4.9' },
                { label: 'Zillow', score: '5.0' },
                { label: 'Yelp', score: '4.7' },
              ].map((r, i) => (
                <span key={r.label} className="flex items-center gap-1.5 text-xs text-gray-500">
                  {i > 0 && <span className="text-gray-300 text-xs mr-1 hidden sm:inline">·</span>}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="#F59E0B">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span className="font-semibold text-gray-600">{r.score}</span>
                  <span className="text-gray-400">{r.label}</span>
                </span>
              ))}
              <span className="text-gray-300 hidden sm:inline text-xs">·</span>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                No credit pull · Free
              </span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
