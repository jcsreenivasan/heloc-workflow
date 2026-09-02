import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface ChoiceCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  selected: boolean;
  onClick: () => void;
  variant?: 'default' | 'tall' | 'list';
  chevron?: boolean;
}

export function ChoiceCard({
  icon: Icon,
  label,
  description,
  selected,
  onClick,
  variant = 'default',
  chevron = false,
}: ChoiceCardProps) {
  if (variant === 'list') {
    return (
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.01, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer ${
          selected
            ? 'border-primary bg-primary/5 text-primary'
            : 'border-gray-200 bg-white hover:border-secondary/40 hover:shadow-md'
        }`}
        style={{
          boxShadow: selected
            ? '0 0 0 3px rgba(234, 37, 35, 0.15)'
            : undefined,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-2.5 rounded-lg ${
              selected ? 'bg-primary/10' : 'bg-secondary/5'
            }`}
          >
            <Icon
              size={22}
              className={selected ? 'text-primary' : 'text-secondary'}
            />
          </div>
          <div>
            <p
              className={`font-semibold text-sm ${
                selected ? 'text-primary' : 'text-gray-800'
              }`}
            >
              {label}
            </p>
            {description && (
              <p className="text-xs text-gray-500 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {chevron && (
          <svg
            className={`w-5 h-5 transition-colors ${
              selected ? 'text-primary' : 'text-gray-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={onClick}
      whileHover={{
        scale: 1.03,
        boxShadow: selected
          ? '0 8px 30px rgba(234, 37, 35, 0.25)'
          : '0 8px 30px rgba(35, 59, 134, 0.15)',
      }}
      whileTap={{ scale: 0.97 }}
      className={`relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer min-h-[120px] ${
        variant === 'tall' ? 'min-h-[160px]' : ''
      } ${
        selected
          ? 'border-primary bg-primary/5 shadow-lg shadow-primary/20'
          : 'border-gray-200 bg-white hover:border-secondary/40'
      }`}
    >
      {selected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        >
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
      )}
      <motion.div
        animate={{
          backgroundColor: selected ? 'rgba(234, 37, 35, 0.1)' : 'rgba(35, 59, 134, 0.05)',
        }}
        transition={{ duration: 0.2 }}
        className="p-3 rounded-xl"
      >
        <Icon
          size={32}
          className={`transition-colors duration-200 ${
            selected ? 'text-primary' : 'text-secondary'
          }`}
        />
      </motion.div>
      <span
        className={`font-semibold text-sm text-center transition-colors duration-200 ${
          selected ? 'text-primary' : 'text-gray-800'
        }`}
      >
        {label}
      </span>
      {description && (
        <span className="text-xs text-gray-500 text-center">{description}</span>
      )}
    </motion.button>
  );
}
