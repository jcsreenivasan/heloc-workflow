import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, ChevronRight, Home } from 'lucide-react';
import type { FunnelData } from '../../../types/funnel';

interface Props { data: FunnelData; onChange: (u: Partial<FunnelData>) => void; onNext: () => void; }

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtSlider(v: number) {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  return `$${(v / 1000).toFixed(0)}K`;
}

function fmtDisplay(v: number) {
  return v.toLocaleString('en-US');
}

function parseRaw(raw: string): number | null {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return null;
  return parseInt(digits, 10);
}

// ── Editable value card ────────────────────────────────────────────────────────

interface ValCardProps {
  label: string;
  sublabel?: string;
  value: number;
  min: number;
  max: number;
  step: number;
  color: string;
  trackColor: string;
  onChange: (v: number) => void;
}

function ValCard({ label, sublabel, value, min, max, step, color, trackColor, onChange }: ValCardProps) {
  const [editing, setEditing] = useState(false);
  const [raw, setRaw] = useState('');

  const pct = ((value - min) / (max - min)) * 100;

  const commitRaw = useCallback(() => {
    const n = parseRaw(raw);
    if (n !== null) {
      onChange(Math.max(min, Math.min(max, Math.round(n / step) * step)));
    }
    setEditing(false);
  }, [raw, min, max, step, onChange]);

  return (
    <div className="bg-white rounded-2xl border-2 border-gray-100 p-5 space-y-4">
      {/* Label + editable value */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</p>
          {sublabel && <p className="text-xs text-gray-400 mt-0.5">{sublabel}</p>}
        </div>

        {editing ? (
          <div className="flex items-center gap-1.5 bg-gray-50 border-2 rounded-xl px-3 py-1.5" style={{ borderColor: color }}>
            <span className="text-sm font-bold" style={{ color }}>$</span>
            <input
              type="text"
              inputMode="numeric"
              autoFocus
              value={raw}
              onChange={e => setRaw(e.target.value.replace(/[^0-9]/g, ''))}
              onBlur={commitRaw}
              onKeyDown={e => { if (e.key === 'Enter') commitRaw(); if (e.key === 'Escape') setEditing(false); }}
              className="w-28 text-right text-base font-bold focus:outline-none bg-transparent"
              style={{ color }}
            />
          </div>
        ) : (
          <button
            onClick={() => { setRaw(value.toString()); setEditing(true); }}
            className="flex items-baseline gap-0.5 group cursor-text"
            title="Click to edit"
          >
            <span className="text-sm font-bold text-gray-400 group-hover:text-gray-600 transition-colors">$</span>
            <span
              className="text-2xl font-extrabold tabular-nums group-hover:underline decoration-dashed transition-colors"
              style={{ color }}
            >
              {fmtDisplay(value)}
            </span>
            <span className="ml-1.5 text-xs text-gray-300 group-hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100">✎</span>
          </button>
        )}
      </div>

      {/* Slider */}
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="slider-input w-full"
          style={{
            background: `linear-gradient(to right, ${trackColor} ${pct}%, #E5E7EB ${pct}%)`,
            accentColor: trackColor,
          }}
        />
        <div className="flex justify-between mt-1.5">
          <span className="text-xs text-gray-400">{fmtSlider(min)}</span>
          <span className="text-xs text-gray-400">{fmtSlider(max)}</span>
        </div>
      </div>
    </div>
  );
}

// ── Step ──────────────────────────────────────────────────────────────────────

export function StepFinancials({ data, onChange, onNext }: Props) {
  const maxDown = Math.round(data.propertyValue * 0.95 / 1000) * 1000;
  const cappedDown = Math.min(data.downPayment, maxDown);
  const downPct = data.propertyValue > 0
    ? ((cappedDown / data.propertyValue) * 100).toFixed(1)
    : '0.0';

  const handlePropertyValue = (val: number) => {
    const newMax = Math.round(val * 0.95 / 1000) * 1000;
    onChange({ propertyValue: val, downPayment: Math.min(data.downPayment, newMax) });
  };

  return (
    <div>
      <div className="px-6 pt-7 pb-6 bg-gradient-to-b from-blue-50/70 to-white">
        <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center mb-4">
          <Home size={24} className="text-blue-600" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-1">Property value & down payment</h2>
        <p className="text-sm text-gray-500">
          Drag the sliders or <span className="font-semibold text-blue-600">click the amount</span> to type an exact value.
        </p>
      </div>

      <div className="px-6 pb-7 space-y-4">
        <ValCard
          label="Property Value"
          value={data.propertyValue}
          min={100000}
          max={2000000}
          step={5000}
          color="#233B86"
          trackColor="#233B86"
          onChange={handlePropertyValue}
        />

        <ValCard
          label="Down Payment"
          sublabel={`${downPct}% of property value`}
          value={cappedDown}
          min={0}
          max={maxDown}
          step={1000}
          color="#EA2523"
          trackColor="#EA2523"
          onChange={val => onChange({ downPayment: val })}
        />

        {/* Loan amount pill */}
        <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
          <div className="flex items-center gap-2">
            <DollarSign size={15} className="text-gray-400" />
            <span className="text-sm text-gray-500 font-medium">Estimated Loan Amount</span>
          </div>
          <span className="text-base font-extrabold text-gray-800">
            ${(data.propertyValue - cappedDown).toLocaleString('en-US')}
          </span>
        </div>

        <motion.button
          onClick={onNext}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-base text-white flex items-center justify-center gap-2 bg-[#EA2523] shadow-lg shadow-[#EA2523]/25 hover:bg-[#C41E1C] transition-colors"
        >
          Continue <ChevronRight size={20} />
        </motion.button>
      </div>
    </div>
  );
}
