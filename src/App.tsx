import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFunnel } from './hooks/useFunnel';
import { FunnelLayout } from './components/funnel/FunnelLayout';
import { StepOne } from './components/funnel/steps/StepOne';
import { StepTwo } from './components/funnel/steps/StepTwo';
import { StepThree } from './components/funnel/steps/StepThree';
import { DisqualifiedScreen } from './components/funnel/DisqualifiedScreen';
import { LeadCapture } from './components/funnel/LeadCapture';
import { LoadingScreen } from './components/funnel/LoadingScreen';
import { RatesDisplay } from './components/funnel/RatesDisplay';

function FunnelModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
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
  } = useFunnel();

  const renderStep = () => {
    switch (currentStep) {
      case 'step1':
        return <StepOne data={data} onChange={updateData} onNext={goNext} />;
      case 'step2':
        return <StepTwo data={data} onChange={updateData} onNext={goNext} />;
      case 'step3':
        return <StepThree data={data} onChange={updateData} onNext={goNext} />;
      case 'disqualified':
        return <DisqualifiedScreen onClose={onClose} />;
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
  { value: '$250K',    label: 'Avg. HELOC Amount' },
  { value: '4.9★',    label: 'Google Rating' },
  { value: '50,000+', label: 'Homeowners Helped' },
  { value: '25 Yrs',  label: 'In Business' },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instant HELOC Check',
    desc: 'See personalized HELOC rates in under 2 minutes — no SSN required.',
  },
  {
    icon: '🔒',
    title: '100% Secure',
    desc: 'Your information is encrypted and never shared with third parties.',
  },
  {
    icon: '✅',
    title: 'No Credit Pull',
    desc: 'Checking your rate has zero impact on your credit score.',
  },
];

export default function App() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="border-b border-gray-100 bg-white/95 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <img
            src="/texas-united-logo.webp"
            alt="Texas United Mortgage"
            className="h-9 w-auto object-contain"
          />
          <a
            href="tel:+18005551234"
            className="text-sm font-semibold text-[#233B86] hover:text-[#EA2523] transition-colors hidden sm:block"
          >
            (800) 555-1234
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-5"
            style={{ background: '#233B86', transform: 'translate(30%, -30%)' }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-5"
            style={{ background: '#EA2523', transform: 'translate(-20%, 20%)' }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 pt-16 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block bg-[#EA2523]/8 text-[#EA2523] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
              Texas's #1 HELOC Lender
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#233B86] leading-tight mb-5">
              Tap Into Your<br />
              <span className="text-[#EA2523]">Home Equity</span> Today
            </h1>
            <p className="text-gray-500 text-lg max-w-xl mx-auto mb-10">
              Answer 8 quick questions and see your personalized HELOC options instantly.
              No credit check. No SSN. 100% free.
            </p>

            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{ scale: 1.04, boxShadow: '0 16px 48px rgba(234,37,35,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="px-10 py-4 bg-[#EA2523] text-white font-bold text-base rounded-2xl transition-all inline-flex items-center gap-3"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Check My HELOC Rate
            </motion.button>

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

        <div className="flex justify-center mt-12">
          <motion.button
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 bg-[#EA2523] text-white font-bold text-sm rounded-xl hover:bg-[#C41E1C] transition-colors"
          >
            Check My HELOC Rate
          </motion.button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-5 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Texas United Mortgage Company · NMLS #46749 ·{' '}
          <a href="tel:+18005551234" className="hover:text-[#233B86] transition-colors">
            (800) 555-1234
          </a>
        </p>
        <p className="text-xs text-gray-300 mt-1">
          Equal Housing Opportunity Lender. This is not a loan commitment. Rates subject to change.
        </p>
      </footer>

      {isOpen && (
        <FunnelModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </div>
  );
}
