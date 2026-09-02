import { motion } from 'framer-motion';
import { MapPin, ChevronRight } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface StepLocationProps {
  data: FunnelData;
  onChange: (updates: Partial<FunnelData>) => void;
  onNext: () => void;
}

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
  'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma',
  'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function StepLocation({ data, onChange, onNext }: StepLocationProps) {
  const isValid = data.state && data.zip.length === 5 && /^\d+$/.test(data.zip);

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full max-w-md"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 text-white" style={{ backgroundColor: '#EA2523' }}>
            Step 5 of 8
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: '#233B86' }}>
            Where is the property located?
          </h1>
          <p className="text-gray-500 text-base">
            Rates can vary by location. Enter your property's state and ZIP code.
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State
            </label>
            <div className="relative">
              <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={data.state}
                onChange={e => onChange({ state: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:border-secondary focus:outline-none transition-colors appearance-none bg-white"
                style={{ colorScheme: 'light' }}
              >
                <option value="">Select a state...</option>
                {US_STATES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              ZIP Code
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="e.g. 77001"
              value={data.zip}
              maxLength={5}
              onChange={e => {
                const v = e.target.value.replace(/\D/g, '');
                onChange({ zip: v });
              }}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 font-medium focus:border-secondary focus:outline-none transition-colors"
            />
            {data.zip.length > 0 && data.zip.length < 5 && (
              <p className="text-xs text-red-500 mt-1">Please enter a 5-digit ZIP code</p>
            )}
          </div>

          <motion.button
            onClick={onNext}
            disabled={!isValid}
            whileHover={isValid ? { scale: 1.02 } : {}}
            whileTap={isValid ? { scale: 0.98 } : {}}
            className={`w-full py-3.5 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
              isValid
                ? 'shadow-lg shadow-primary/25 hover:shadow-primary/40'
                : 'opacity-50 cursor-not-allowed'
            }`}
            style={{ backgroundColor: isValid ? '#EA2523' : '#9CA3AF' }}
          >
            Continue
            <ChevronRight size={20} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
