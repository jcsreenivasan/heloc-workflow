import { useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFunnel } from './hooks/useFunnel';
import { FunnelLayout } from './components/funnel/FunnelLayout';
import { StepPropertyType } from './components/funnel/steps/StepPropertyType';
import { StepResidencyType } from './components/funnel/steps/StepResidencyType';
import { StepTimeline } from './components/funnel/steps/StepTimeline';
import { StepLocation } from './components/funnel/steps/StepLocation';
import { StepFinancials } from './components/funnel/steps/StepFinancials';
import { StepCreditScore } from './components/funnel/steps/StepCreditScore';
import { StepMilitary } from './components/funnel/steps/StepMilitary';
import { LeadCapture } from './components/funnel/LeadCapture';
import { LoadingScreen } from './components/funnel/LoadingScreen';
import { RatesDisplay } from './components/funnel/RatesDisplay';

function FunnelModal({ isOpen, onClose, purpose }: { isOpen: boolean; onClose: () => void; purpose: 'purchase' | 'refinance' }) {
  const {
    currentStep,
    direction,
    data,
    updateData,
    goNext,
    goBack,
    currentQuestionIndex,
    isQuestionStep,
    totalQuestions,
    canGoBack,
  } = useFunnel(purpose);

  const autoAdvance = useCallback((updater: () => void) => {
    updater();
    setTimeout(goNext, 160);
  }, [goNext]);

  const renderStep = () => {
    switch (currentStep) {
      case 'property-type':
        return <StepPropertyType data={data} onSelect={v => autoAdvance(() => updateData({ propertyType: v }))} />;
      case 'residency-type':
        return <StepResidencyType data={data} onSelect={v => autoAdvance(() => updateData({ residencyType: v }))} />;
      case 'timeline':
        return <StepTimeline data={data} onSelect={v => autoAdvance(() => updateData({ timeline: v }))} />;
      case 'location':
        return <StepLocation data={data} onChange={updateData} onNext={goNext} />;
      case 'financials':
        return <StepFinancials data={data} onChange={updateData} onNext={goNext} />;
      case 'credit-score':
        return <StepCreditScore data={data} onChange={updateData} onNext={goNext} />;
      case 'military':
        return <StepMilitary data={data} onSelect={v => autoAdvance(() => updateData({ military: v }))} />;
      case 'lead-capture':
        return <LeadCapture data={data} onChange={updateData} onSubmit={goNext} />;
      case 'loading':
        return <LoadingScreen onComplete={goNext} />;
      case 'rates':
        return <RatesDisplay data={data} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <FunnelLayout
          currentStep={currentStep}
          currentQuestionIndex={currentQuestionIndex}
          isQuestionStep={isQuestionStep}
          totalQuestions={totalQuestions}
          canGoBack={canGoBack}
          onBack={goBack}
          onClose={onClose}
          direction={direction}
        >
          {renderStep()}
        </FunnelLayout>
      )}
    </AnimatePresence>
  );
}

// ─── Landing Page ──────────────────────────────────────────────────────────────

const STATS = [
  { value: '50,000+', label: 'Loans Closed' },
  { value: '$12B+',   label: 'Loan Volume' },
  { value: '4.9★',    label: 'Google Rating' },
  { value: '25 Yrs',  label: 'In Business' },
];

const FEATURES = [
  { icon: '⚡', title: 'Instant Rate Check', desc: 'See personalized rates in under 2 minutes — no SSN required.' },
  { icon: '🔒', title: '100% Secure',        desc: 'Your information is encrypted and never shared with third parties.' },
  { icon: '✅', title: 'No Credit Pull',     desc: 'Checking your rate has zero impact on your credit score.' },
];

export default function App() {
  const [loanPurpose, setLoanPurpose] = useState<'purchase' | 'refinance' | null>(null);
  const isOpen = loanPurpose !== null;

  const openModal = (purpose: 'purchase' | 'refinance') => setLoanPurpose(purpose);
  const closeModal = () => setLoanPurpose(null);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#233B86' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" fill="white"/>
              </svg>
            </div>
            <span className="font-bold text-[#233B86] text-sm">Texas United Mortgage</span>
          </div>
          <a href="tel:+18005551234" className="text-sm font-semibold text-[#233B86] hover:text-[#EA2523] transition-colors hidden sm:block">
            (800) 555-1234
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-5" style={{ background: '#233B86', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5" style={{ background: '#EA2523', transform: 'translate(-20%, 20%)' }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-[#EA2523]/8 text-[#EA2523] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Texas's #1 Mortgage Lender
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#233B86] leading-tight mb-5">
              Get Your Personalized<br />
              <span className="text-[#EA2523]">Mortgage Rate</span> Today
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
              Answer 7 quick questions and see your custom rates instantly.
              No credit check. No SSN. 100% free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => openModal('purchase')}
                whileHover={{ scale: 1.04, boxShadow: '0 16px 48px rgba(234,37,35,0.35)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 bg-[#EA2523] text-white font-bold text-base rounded-2xl shadow-xl shadow-[#EA2523]/25 transition-all flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                I'm Purchasing
              </motion.button>

              <motion.button
                onClick={() => openModal('refinance')}
                whileHover={{ scale: 1.04, boxShadow: '0 16px 48px rgba(35,59,134,0.25)' }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 bg-[#233B86] text-white font-bold text-base rounded-2xl shadow-xl shadow-[#233B86]/20 transition-all flex items-center justify-center gap-3"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M23 4v6h-6" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                I'm Refinancing
              </motion.button>
            </div>

            <p className="text-xs text-gray-400 mt-4">
              No credit check · Takes 2 minutes · Free personalized rates
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#233B86] py-10">
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
              >
                <p className="text-2xl sm:text-3xl font-black text-white">{s.value}</p>
                <p className="text-sm text-white/50 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-5 sm:px-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-black text-[#233B86] text-center mb-10">Why Texas United?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl"
            >
              <span className="text-3xl mb-3">{f.icon}</span>
              <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA repeat */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <motion.button
            onClick={() => openModal('purchase')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 bg-[#EA2523] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C] transition-colors"
          >
            Check Purchase Rates
          </motion.button>
          <motion.button
            onClick={() => openModal('refinance')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 bg-white text-[#233B86] font-bold text-sm rounded-xl border-2 border-[#233B86] hover:bg-[#233B86]/5 transition-colors"
          >
            Check Refinance Rates
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-5 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Texas United Mortgage Company · NMLS #46749 ·{' '}
          <a href="tel:+18005551234" className="hover:text-[#233B86] transition-colors">(800) 555-1234</a>
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Equal Housing Opportunity Lender. This is not a loan commitment. Rates subject to change.
        </p>
      </footer>

      {/* Modal — key forces full remount when purpose changes */}
      {loanPurpose && (
        <FunnelModal
          key={loanPurpose}
          isOpen={isOpen}
          onClose={closeModal}
          purpose={loanPurpose}
        />
      )}
    </div>
  );
}
