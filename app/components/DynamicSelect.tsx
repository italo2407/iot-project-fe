import React, { useEffect, useState } from 'react';

interface Option {
  label: string;
  value: string | number;
}

interface DynamicSelectProps {
  value: string | number;
  onChange: (value: string) => void;
  label?: string;
  options?: Option[];
  placeholder?: string;
  direction?: 'row' | 'col';
}

const DynamicSelect = ({
  value,
  onChange,
  label = 'Seleccionar',
  options = [],
  placeholder = '-- Selecciona --',
  direction = 'col',
}: DynamicSelectProps) => {
  return (
    <div
      className={`w-full max-w-sm flex ${
        direction === 'row' ? 'flex-row items-center gap-2' : 'flex-col'
      }`}>
      {label && (
        <label className="block text-gray-700 text-sm mb-1">{label}</label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="block w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-500">
        <option value="">{placeholder}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DynamicSelect;
