import React from 'react';
import './SliderInput.css';

interface Props {
  id: string;
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  unit?: string;
  badge?: string;
  badgeColor?: string;
  onChange: (v: number) => void;
}

const SliderInput: React.FC<Props> = ({
  id, label, min, max, step = 1, value, unit = '', badge, badgeColor = '#00e5ff', onChange
}) => {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="slider-input">
      <div className="slider-header">
        <label htmlFor={id} className="slider-label">
          {label}
          {badge && (
            <span className="slider-badge" style={{ borderColor: badgeColor, color: badgeColor }}>
              {badge}
            </span>
          )}
        </label>
        <span className="slider-value" style={{ color: badgeColor }}>
          {step < 1 ? value.toFixed(2) : value}{unit}
        </span>
      </div>
      <div className="slider-track-wrapper">
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="slider-range"
          style={{ '--pct': `${pct}%`, '--thumb-color': badgeColor } as React.CSSProperties}
        />
      </div>
      <div className="slider-minmax">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
};

export default SliderInput;
