import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Phone, Shield, AlertCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';
import type { FunnelData, RateData } from '../../types/funnel';
import { calculateRates } from '../../utils/rateCalculator';
import { generateRatePDF } from '../../utils/pdfGenerator';

interface RatesDisplayProps {
  data: FunnelData;
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function useCountUp(target: number, ms = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - start) / ms, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(target * e);
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [target, ms]);
  return val;
}

function ConfettiEffect() {
  const colors = ['#EA2523', '#233B86', '#FFD700', '#16A34A', '#ffffff'];
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[60]">
      {Array.from({ length: 32 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-sm"
          style={{ left: `${Math.random() * 100}%`, backgroundColor: colors[i % colors.length] }}
          initial={{ y: -10, opacity: 1, rotate: 0 }}
          animate={{ y: window.innerHeight, opacity: [1, 1, 0], rotate: Math.random() * 540 - 270, x: Math.random() * 160 - 80 }}
          transition={{ duration: 1.8 + Math.random() * 1.2, delay: Math.random() * 0.6, ease: 'easeIn' }}
        />
      ))}
    </div>
  );
}

function RateCard({ rate, data, index }: { rate: RateData; data: FunnelData; index: number }) {
  const [downloading, setDownloading] = useState(false);
  const rateAnim = useCountUp(rate.interestRate);
  const paymentAnim = useCountUp(rate.monthlyPayment);
  const loanAmount = data.propertyValue - data.downPayment;

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => { generateRatePDF(data, calculateRates(data)); setDownloading(false); }, 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 + index * 0.12, type: 'spring', stiffness: 280, damping: 26 }}
      className={`bg-white rounded-xl border-2 overflow-hidden ${
        index === 0 ? 'border-[#233B86]' : 'border-gray-200'
      }`}
    >
      {/* Card header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        index === 0 ? 'bg-[#233B86]' : 'bg-gray-50 border-b border-gray-100'
      }`}>
        <div>
          <p className={`text-sm font-bold ${index === 0 ? 'text-white' : 'text-gray-800'}`}>{rate.term}</p>
          <p className={`text-xs ${index === 0 ? 'text-white/60' : 'text-gray-400'}`}>Fixed rate mortgage</p>
        </div>
        {rate.badge && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
            index === 0 ? 'bg-[#EA2523] text-white' : 'bg-[#233B86] text-white'
          }`}>
            {rate.badge}
          </span>
        )}
      </div>

      <div className="p-4">
        {/* Rate + payment */}
        <div className="flex items-end justify-between mb-4 pb-4 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 mb-0.5">Interest Rate</p>
            <p className="text-3xl font-black text-[#233B86]">{rateAnim.toFixed(3)}%</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 mb-0.5">Est. Monthly</p>
            <p className="text-xl font-bold text-[#EA2523]">{fmtCurrency(paymentAnim)}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
          </div>
        </div>

        {/* Detail grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: 'APR', value: `${rate.apr.toFixed(3)}%` },
            { label: 'Loan Amount', value: fmtCurrency(loanAmount) },
            { label: 'Down Payment', value: fmtCurrency(data.downPayment) },
            { label: 'LTV', value: `${((loanAmount / data.propertyValue) * 100).toFixed(0)}%` },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-lg px-3 py-2">
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="text-sm font-bold text-gray-800 mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Notices */}
        {rate.isPMI && (
          <div className="flex gap-2 p-2.5 bg-orange-50 border border-orange-100 rounded-lg mb-3">
            <AlertCircle size={13} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-orange-700">PMI may apply — LTV exceeds 80%</p>
          </div>
        )}
        {rate.isVA && (
          <div className="flex gap-2 p-2.5 bg-green-50 border border-green-100 rounded-lg mb-3">
            <Shield size={13} className="text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-green-700">VA benefit applied — potential 0% down</p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-2">
          <motion.button
            onClick={handleDownload}
            disabled={downloading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-xl font-bold text-white text-xs flex items-center justify-center gap-1.5 bg-[#EA2523] hover:bg-[#C41E1C] transition-colors shadow-sm"
          >
            {downloading ? (
              <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full" />Generating...</>
            ) : (
              <><Download size={13} />Download Rate Sheet</>
            )}
          </motion.button>
          <a
            href="tel:+18005551234"
            className="w-full py-2.5 rounded-xl font-semibold border border-[#233B86] text-[#233B86] flex items-center justify-center gap-1.5 hover:bg-[#233B86]/5 transition-colors text-xs"
          >
            <Phone size={13} />Talk to a Loan Officer
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function LoanSummary({ data }: { data: FunnelData }) {
  const [open, setOpen] = useState(false);
  const loanAmount = data.propertyValue - data.downPayment;

  const rows = [
    { label: 'Purpose', value: data.loanPurpose ? data.loanPurpose.charAt(0).toUpperCase() + data.loanPurpose.slice(1) : '—' },
    { label: 'Property', value: data.propertyType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—' },
    { label: 'Occupancy', value: data.residencyType?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || '—' },
    { label: 'ZIP', value: data.zip || '—' },
    { label: 'Value', value: fmtCurrency(data.propertyValue) },
    { label: 'Down', value: fmtCurrency(data.downPayment) },
    { label: 'Loan', value: fmtCurrency(loanAmount) },
    { label: 'Credit', value: data.creditScore.toString() },
    { label: 'Military', value: data.military ? 'Yes (VA)' : 'No' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-[#EEF1FB] rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3"
      >
        <div className="flex items-center gap-2">
          <Check size={15} className="text-[#233B86]" />
          <span className="text-sm font-bold text-[#233B86]">Your Loan Summary</span>
        </div>
        {open ? <ChevronUp size={15} className="text-[#233B86]" /> : <ChevronDown size={15} className="text-[#233B86]" />}
      </button>

      <motion.div
        initial={false}
        animate={{ height: open ? 'auto' : 0 }}
        className="overflow-hidden"
      >
        <div className="px-4 pb-3 grid grid-cols-2 gap-x-4 gap-y-2">
          {rows.map(r => (
            <div key={r.label} className="flex justify-between col-span-1">
              <span className="text-xs text-gray-500">{r.label}</span>
              <span className="text-xs font-semibold text-gray-700">{r.value}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function RatesDisplay({ data }: RatesDisplayProps) {
  const rates = calculateRates(data);

  return (
    <div className="px-4 py-5 bg-gray-50">
      <ConfettiEffect />

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 1.8 }} className="w-2 h-2 rounded-full bg-[#EA2523]" />
          <span className="text-xs font-bold uppercase tracking-widest text-[#EA2523]">Live Rates · Updated Today</span>
        </div>
        <h2 className="text-xl font-black text-[#233B86]">Your Personalized Offers</h2>
        {data.lead.name && (
          <p className="text-sm text-gray-500 mt-0.5">Hi {data.lead.name.split(' ')[0]}! Based on your profile:</p>
        )}
      </motion.div>

      {/* Loan summary accordion */}
      <div className="mb-4">
        <LoanSummary data={data} />
      </div>

      {/* Rate cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {rates.map((rate, i) => (
          <RateCard key={rate.term} rate={rate} data={data} index={i} />
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-gray-400 text-center leading-relaxed">
        Estimates only. Not a commitment. Rates subject to credit verification and market changes.
        Texas United Mortgage — NMLS #46749.
      </p>
    </div>
  );
}
