import React from 'react';
import './SelectInput.css';

interface Option {
  label: string;
  value: number;
}

interface Props {
  id: string;
  label: string;
  options: Option[];
  value: number;
  onChange: (v: number) => void;
}

const SelectInput: React.FC<Props> = ({ id, label, options, value, onChange }) => {
  return (
    <div className="select-input">
      <label htmlFor={id} className="select-label">{label}</label>
      <div className="select-wrapper">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="select-el"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="select-arrow">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SelectInput;
