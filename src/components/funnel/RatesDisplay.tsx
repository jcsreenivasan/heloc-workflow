import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Phone, Shield, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { FunnelData, RateData } from '../../types/funnel';
import { calculateRates } from '../../utils/rateCalculator';
import { generateRatePDF } from '../../utils/pdfGenerator';

interface RatesDisplayProps {
  data: FunnelData;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);
}

function useCountUp(target: number, duration = 1200, decimals = 3): string {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(target * eased);
      if (progress < 1) requestAnimationFrame(tick);
      else setCurrent(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return current.toFixed(decimals);
}

function CountUpRate({ value }: { value: number }) {
  const display = useCountUp(value, 1200, 3);
  return <span>{display}%</span>;
}

function CountUpPayment({ value }: { value: number }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(tick);
      else setCurrent(Math.round(value));
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span>{formatCurrency(current)}</span>;
}

function ConfettiEffect() {
  const colors = ['#EA2523', '#233B86', '#FFD700', '#16A34A', '#fff'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2.5 h-2.5 rounded-sm"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
          }}
          initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
          animate={{
            y: window.innerHeight + 50,
            opacity: [1, 1, 0],
            rotate: Math.random() * 720 - 360,
            x: Math.random() * 200 - 100,
          }}
          transition={{
            duration: 2 + Math.random() * 1.5,
            delay: Math.random() * 0.8,
            ease: 'easeIn',
          }}
        />
      ))}
    </div>
  );
}

function RateCard({ rate, data, index }: { rate: RateData; data: FunnelData; index: number }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    const rates = calculateRates(data);
    setTimeout(() => {
      generateRatePDF(data, rates);
      setDownloading(false);
    }, 500);
  };

  const loanAmount = data.propertyValue - data.downPayment;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.15, type: 'spring', stiffness: 260, damping: 24 }}
      className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden ${
        index === 0 ? 'border-secondary' : 'border-gray-200'
      }`}
    >
      {/* Badge */}
      {rate.badge && (
        <div
          className="absolute top-0 right-0 px-4 py-1.5 text-xs font-bold text-white rounded-bl-xl"
          style={{ backgroundColor: index === 0 ? '#233B86' : '#EA2523' }}
        >
          {rate.badge}
        </div>
      )}

      <div className="p-5 sm:p-6">
        {/* Term header */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-800 text-lg">{rate.term}</h3>
          <p className="text-xs text-gray-400">Fixed rate · 30 payments guaranteed</p>
        </div>

        {/* Main rate + payment */}
        <div className="flex items-end justify-between mb-5 pb-5 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-1">Interest Rate</p>
            <p className="text-4xl font-black rate-number" style={{ color: '#233B86' }}>
              <CountUpRate value={rate.interestRate} />
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-1">Est. Monthly Payment</p>
            <p className="text-2xl font-bold" style={{ color: '#EA2523' }}>
              <CountUpPayment value={rate.monthlyPayment} />
            </p>
            <p className="text-xs text-gray-400">/month</p>
          </div>
        </div>

        {/* Rate details grid */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            { label: 'APR', value: `${rate.apr.toFixed(3)}%` },
            { label: 'Loan Amount', value: formatCurrency(loanAmount) },
            { label: 'Down Payment', value: formatCurrency(data.downPayment) },
            { label: 'Down %', value: `${((data.downPayment / data.propertyValue) * 100).toFixed(1)}%` },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-bold text-gray-800">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Notices */}
        {rate.isPMI && (
          <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-xl mb-3 border border-orange-200">
            <AlertCircle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700">PMI may apply — LTV exceeds 80%. Consider a larger down payment to eliminate PMI.</p>
          </div>
        )}
        {rate.isVA && (
          <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl mb-3 border border-green-200">
            <Shield size={14} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">VA loan benefit applied — potential 0% down with no PMI for eligible veterans.</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <motion.button
            onClick={handleDownload}
            disabled={downloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 transition-all"
            style={{ backgroundColor: '#EA2523', boxShadow: '0 4px 16px rgba(234, 37, 35, 0.25)' }}
          >
            {downloading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                />
                Generating PDF...
              </>
            ) : (
              <>
                <Download size={16} />
                Download Rate Sheet
              </>
            )}
          </motion.button>
          <a
            href="tel:+18005551234"
            className="w-full py-3 rounded-xl font-semibold border-2 border-secondary text-secondary flex items-center justify-center gap-2 hover:bg-secondary/5 transition-colors text-sm"
          >
            <Phone size={16} />
            Talk to a Loan Officer
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function LoanSummary({ data }: { data: FunnelData }) {
  const [expanded, setExpanded] = useState(false);
  const loanAmount = data.propertyValue - data.downPayment;
  const ltv = ((loanAmount / data.propertyValue) * 100).toFixed(1);

  const rows = [
    { label: 'Loan Purpose', value: data.loanPurpose ? (data.loanPurpose.charAt(0).toUpperCase() + data.loanPurpose.slice(1)) : '—' },
    { label: 'Property Type', value: data.propertyType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—' },
    { label: 'Residency', value: data.residencyType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—' },
    { label: 'Location', value: data.state ? `${data.state}${data.zip ? ` ${data.zip}` : ''}` : '—' },
    { label: 'Property Value', value: formatCurrency(data.propertyValue) },
    { label: 'Down Payment', value: formatCurrency(data.downPayment) },
    { label: 'Loan Amount', value: formatCurrency(loanAmount) },
    { label: 'LTV', value: `${ltv}%` },
    { label: 'Credit Score', value: `${data.creditScore}` },
    { label: 'Military/VA', value: data.military ? 'Yes' : 'No' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-secondary rounded-2xl p-5 text-white"
    >
      <div className="flex items-center gap-2 mb-4">
        <Check size={18} className="text-green-400" />
        <h3 className="font-bold text-base">Your Loan Summary</h3>
      </div>

      {/* Always show on desktop, toggle on mobile */}
      <div className="hidden sm:block space-y-2">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0">
            <span className="text-white/60 text-xs">{row.label}</span>
            <span className="text-white text-xs font-semibold">{row.value}</span>
          </div>
        ))}
      </div>

      {/* Mobile accordion */}
      <div className="sm:hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full text-white/80 text-sm"
        >
          <span>View full summary</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {expanded && (
          <div className="mt-3 space-y-2">
            {rows.map(row => (
              <div key={row.label} className="flex justify-between items-center py-1.5 border-b border-white/10 last:border-0">
                <span className="text-white/60 text-xs">{row.label}</span>
                <span className="text-white text-xs font-semibold">{row.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-white/40 text-xs text-center">
          Rates valid as of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </motion.div>
  );
}

export function RatesDisplay({ data }: RatesDisplayProps) {
  const rates = calculateRates(data);

  return (
    <div className="min-h-full bg-gray-50">
      <ConfettiEffect />

      <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2.5 h-2.5 rounded-full bg-primary"
            />
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#EA2523' }}>
              Live Rates · Updated Today
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black mb-2" style={{ color: '#233B86' }}>
            Your Personalized Rate Offers
          </h1>
          <p className="text-gray-500 text-sm">
            Hello, {data.lead.name.split(' ')[0] || 'there'}! Based on your information, here are your estimated rates.
          </p>
        </motion.div>

        {/* Main layout: sidebar + cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <LoanSummary data={data} />
          </div>

          {/* Rate cards */}
          <div className="lg:col-span-2 order-1 lg:order-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rates.map((rate, i) => (
              <RateCard key={rate.term} rate={rate} data={data} index={i} />
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 p-4 bg-white rounded-xl border border-gray-200"
        >
          <p className="text-xs text-gray-400 text-center leading-relaxed">
            <strong>Disclaimer:</strong> Rates shown are estimates based on information provided and current market conditions.
            Actual rates may vary based on credit verification, income documentation, property appraisal, and market changes.
            This is not a loan commitment or guarantee. Contact a licensed loan officer for official quotes and a Loan Estimate.
            Texas United Mortgage Company — NMLS #46749.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
