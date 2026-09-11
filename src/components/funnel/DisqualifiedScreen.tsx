import { motion } from 'framer-motion';
import { Phone, X } from 'lucide-react';

interface DisqualifiedScreenProps {
  onClose: () => void;
}

export function DisqualifiedScreen({ onClose }: DisqualifiedScreenProps) {
  return (
    <div className="px-5 py-10 flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 22 }}
        className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6"
      >
        <span className="text-4xl">🏠</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h2 className="text-xl font-black text-gray-900 mb-3">
          HELOCs Require Homeownership
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto mb-8">
          A Home Equity Line of Credit (HELOC) is only available to homeowners,
          since it's secured against your property's equity. If you're planning
          to buy, we can help with that too!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="w-full max-w-xs space-y-3"
      >
        <a
          href="tel:+18005551234"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#233B86] text-white font-bold text-sm rounded-xl shadow-lg shadow-[#233B86]/20 hover:bg-[#1a2d6b] transition-colors"
        >
          <Phone size={15} />
          Talk to a Loan Officer
        </a>

        <button
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3 text-gray-500 font-semibold text-sm rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          <X size={14} />
          Close
        </button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="text-xs text-gray-400 mt-8 max-w-xs"
      >
        Interested in purchasing a home?{' '}
        <a href="tel:+18005551234" className="text-[#233B86] font-semibold hover:underline">
          Call us at (800) 555-1234
        </a>
        {' '}and we'll walk you through your options.
      </motion.p>
    </div>
  );
}
