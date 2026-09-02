import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, ChevronRight, Loader2 } from 'lucide-react';
import type { FunnelData } from '../../types/funnel';

interface LeadCaptureProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onSubmit: () => void;
}

function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export function LeadCapture({ data, onChange, onSubmit }: LeadCaptureProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.lead.name.trim()) e.name = 'Full name is required';
    if (!data.lead.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.lead.email)) e.email = 'Enter a valid email address';
    const digits = data.lead.phone.replace(/\D/g, '');
    if (!digits) e.phone = 'Phone number is required';
    else if (digits.length !== 10) e.phone = 'Enter a 10-digit phone number';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      onSubmit();
    }, 800);
  };

  const handlePhoneChange = (raw: string) => {
    const formatted = formatPhone(raw);
    onChange({ lead: { ...data.lead, phone: formatted } });
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8 relative">
      {/* Blurred rate preview background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-32 bg-secondary rounded-2xl" />
          <div className="absolute top-1/3 right-1/4 w-64 h-32 bg-primary rounded-2xl" />
          <div className="absolute bottom-1/4 left-1/3 w-48 h-24 bg-secondary/50 rounded-xl" />
        </div>
        <div className="absolute inset-0" style={{ backdropFilter: 'blur(2px)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative w-full max-w-md glass rounded-3xl shadow-2xl border border-white/60 p-8"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#233B86' }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <h2 className="text-2xl font-bold mb-1" style={{ color: '#233B86' }}>
            Unlock Your Personalized Rates
          </h2>
          <p className="text-gray-500 text-sm">
            No SSN required · 100% free · No hard credit pull
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={data.lead.name}
              onChange={e => {
                onChange({ lead: { ...data.lead, name: e.target.value } });
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl font-medium text-gray-800 focus:outline-none transition-all ${
                errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-secondary'
              }`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={data.lead.email}
              onChange={e => {
                onChange({ lead: { ...data.lead, email: e.target.value } });
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              className={`w-full px-4 py-3 border-2 rounded-xl font-medium text-gray-800 focus:outline-none transition-all ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-secondary'
              }`}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              value={data.lead.phone}
              onChange={e => handlePhoneChange(e.target.value)}
              className={`w-full px-4 py-3 border-2 rounded-xl font-medium text-gray-800 focus:outline-none transition-all ${
                errors.phone ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-secondary'
              }`}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={submitting}
            whileHover={!submitting ? { scale: 1.02 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
            className="w-full py-4 rounded-xl font-bold text-white text-base flex items-center justify-center gap-2 shadow-lg transition-all mt-2"
            style={{ backgroundColor: '#EA2523', boxShadow: '0 8px 32px rgba(234, 37, 35, 0.35)' }}
          >
            {submitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Preparing your rates...
              </>
            ) : (
              <>
                See My Rates
                <ChevronRight size={20} />
              </>
            )}
          </motion.button>
        </div>

        {/* Trust indicators */}
        <div className="flex items-center justify-center gap-2 mt-4 text-gray-400">
          <Lock size={14} />
          <span className="text-xs">Your information is 100% secure and never shared</span>
        </div>

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Almost there! Complete this step to see your personalized rates.</p>
        </div>
      </motion.div>
    </div>
  );
}
