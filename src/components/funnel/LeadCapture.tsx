import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Loader2, Sparkles } from 'lucide-react';
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
    setTimeout(onSubmit, 600);
  };

  const inputClass = (key: 'name' | 'email' | 'phone') =>
    `w-full px-4 py-3.5 border-2 rounded-xl text-gray-800 font-medium text-sm focus:outline-none transition-all ${
      errors[key]
        ? 'border-red-400 bg-red-50/50 focus:border-red-500'
        : 'border-gray-200 bg-white focus:border-[#233B86] focus:shadow-[0_0_0_3px_rgba(35,59,134,0.08)]'
    }`;

  return (
    <div>
      {/* Hero band — rates are ready */}
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-[#EA2523]/8 to-white">
        {/* Ready badge */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4"
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 rounded-full bg-emerald-500"
          />
          Your rates are ready!
        </motion.div>

        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">
          Where should we send your results?
        </h2>
        <p className="text-sm text-gray-500">
          No SSN · No hard credit pull · Free — your personalized rates are waiting.
        </p>
      </div>

      {/* Form */}
      <div className="px-6 pb-7 space-y-3.5">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Full Name</label>
          <input
            type="text"
            placeholder="Jane Smith"
            value={data.lead.name}
            onChange={e => { onChange({ lead: { ...data.lead, name: e.target.value } }); setErrors(p => ({ ...p, name: '' })); }}
            className={inputClass('name')}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Email Address</label>
          <input
            type="email"
            placeholder="jane@example.com"
            value={data.lead.email}
            onChange={e => { onChange({ lead: { ...data.lead, email: e.target.value } }); setErrors(p => ({ ...p, email: '' })); }}
            className={inputClass('email')}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
          <input
            type="tel"
            placeholder="(555) 000-0000"
            value={data.lead.phone}
            onChange={e => { onChange({ lead: { ...data.lead, phone: formatPhone(e.target.value) } }); setErrors(p => ({ ...p, phone: '' })); }}
            className={inputClass('phone')}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <motion.button
          onClick={handleSubmit}
          disabled={submitting}
          whileHover={!submitting ? { scale: 1.02 } : {}}
          whileTap={!submitting ? { scale: 0.97 } : {}}
          className="w-full mt-1 py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2.5 bg-[#EA2523] shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C] transition-colors disabled:opacity-70"
        >
          {submitting ? (
            <><Loader2 size={18} className="animate-spin" /> Opening your rates...</>
          ) : (
            <><Sparkles size={18} /> View My Personalized Rates</>
          )}
        </motion.button>

        <div className="flex items-center justify-center gap-1.5 pt-1 text-gray-400">
          <Lock size={12} />
          <span className="text-xs">Your information is encrypted and never sold</span>
        </div>
      </div>
    </div>
  );
}
