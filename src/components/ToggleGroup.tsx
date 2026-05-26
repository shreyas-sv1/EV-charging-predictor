import React from 'react';
import './ToggleGroup.css';

interface Option {
  label: string;
  value: number;
}

interface Props {
  options: Option[];
  value: number;
  onChange: (v: number) => void;
  activeColor?: string;
}

const ToggleGroup: React.FC<Props> = ({ options, value, onChange, activeColor = '#00e5ff' }) => {
  return (
    <div className="toggle-group">
      {options.map((opt) => (
        <button
          key={opt.value}
          className={`toggle-btn ${opt.value === value ? 'active' : ''}`}
          onClick={() => onChange(opt.value)}
          style={opt.value === value ? {
            background: activeColor,
            color: '#000',
            boxShadow: `0 0 12px ${activeColor}66`,
          } : {}}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default ToggleGroup;
