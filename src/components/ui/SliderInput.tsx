import { useState, useRef, useCallback } from 'react';

interface SliderInputProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
  label?: string;
  sublabel?: string;
  color?: string;
}

export function SliderInput({
  value,
  min,
  max,
  step,
  onChange,
  formatValue,
  label,
  sublabel,
  color = '#233B86',
}: SliderInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef<HTMLInputElement>(null);

  const percentage = ((value - min) / (max - min)) * 100;
  const displayValue = formatValue ? formatValue(value) : value.toString();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  }, [onChange]);

  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-baseline mb-3">
          <span className="text-sm font-medium text-gray-600">{label}</span>
          {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
        </div>
      )}

      <div className="relative pt-8 pb-2">
        {/* Value bubble */}
        <div
          className="absolute -top-1 z-10 pointer-events-none"
          style={{
            left: `calc(${percentage}% + ${14 - percentage * 0.28}px)`,
            transform: 'translateX(-50%)',
          }}
        >
          <div
            className="relative px-3 py-1.5 rounded-lg text-white text-sm font-bold shadow-lg transition-transform duration-150"
            style={{
              backgroundColor: color,
              transform: isDragging ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {displayValue}
            <div
              className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
              style={{
                borderLeft: '5px solid transparent',
                borderRight: '5px solid transparent',
                borderTop: `5px solid ${color}`,
              }}
            />
          </div>
        </div>

        {/* Slider track */}
        <input
          ref={sliderRef}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className="slider-input"
          style={{
            background: `linear-gradient(to right, ${color} ${percentage}%, #E5E7EB ${percentage}%)`,
          }}
        />

        {/* Min/Max labels */}
        <div className="flex justify-between mt-2">
          <span className="text-xs text-gray-400">{formatValue ? formatValue(min) : min}</span>
          <span className="text-xs text-gray-400">{formatValue ? formatValue(max) : max}</span>
        </div>
      </div>
    </div>
  );
}
