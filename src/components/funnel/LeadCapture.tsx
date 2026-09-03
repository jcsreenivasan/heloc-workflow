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
    if (!data.lead.name.trim()) e.name = 'Name is required';
    if (!data.lead.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.lead.email)) e.email = 'Enter a valid email';
    const digits = data.lead.phone.replace(/\D/g, '');
    if (!digits) e.phone = 'Phone is required';
    else if (digits.length !== 10) e.phone = 'Enter a 10-digit number';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    setTimeout(onSubmit, 700);
  };

  const field = (key: 'name' | 'email' | 'phone') => ({
    hasError: !!errors[key],
    className: `w-full px-3.5 py-3 border-2 rounded-xl text-gray-800 font-medium text-sm focus:outline-none transition-colors ${
      errors[key] ? 'border-red-400 bg-red-50/50' : 'border-gray-200 focus:border-[#233B86]'
    }`,
  });

  return (
    <div className="px-5 py-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-[#233B86]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 12L12 3L21 12V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V12Z" fill="white"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">Unlock Your Personalized Rates</h2>
          <p className="text-sm text-gray-500">No SSN required · No hard credit pull · 100% free</p>
        </div>

        {/* Form */}
        <div className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Full Name</label>
            <input
              type="text"
              placeholder="Jane Smith"
              value={data.lead.name}
              onChange={e => { onChange({ lead: { ...data.lead, name: e.target.value } }); setErrors(p => ({ ...p, name: '' })); }}
              className={field('name').className}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Email Address</label>
            <input
              type="email"
              placeholder="jane@example.com"
              value={data.lead.email}
              onChange={e => { onChange({ lead: { ...data.lead, email: e.target.value } }); setErrors(p => ({ ...p, email: '' })); }}
              className={field('email').className}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Phone Number</label>
            <input
              type="tel"
              placeholder="(555) 000-0000"
              value={data.lead.phone}
              onChange={e => { onChange({ lead: { ...data.lead, phone: formatPhone(e.target.value) } }); setErrors(p => ({ ...p, phone: '' })); }}
              className={field('phone').className}
            />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
          </div>

          <motion.button
            onClick={handleSubmit}
            disabled={submitting}
            whileHover={!submitting ? { scale: 1.02 } : {}}
            whileTap={!submitting ? { scale: 0.98 } : {}}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 bg-[#EA2523] shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C] transition-colors mt-1"
          >
            {submitting ? (
              <><Loader2 size={17} className="animate-spin" /> Preparing your rates...</>
            ) : (
              <>See My Rates <ChevronRight size={17} /></>
            )}
          </motion.button>
        </div>

        <div className="flex items-center justify-center gap-1.5 mt-4 text-gray-400">
          <Lock size={12} />
          <span className="text-xs">Your information is secure and never sold</span>
        </div>
      </motion.div>
    </div>
  );
}
