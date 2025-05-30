import { useState } from 'react';

type SwitchProps = {
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
};

export default function Switch({
  label = '',
  defaultChecked = false,
  onChange,
}: SwitchProps) {
  const [checked, setChecked] = useState(defaultChecked);

  const toggleSwitch = () => {
    const newValue = !checked;
    setChecked(newValue);
    onChange?.(newValue); // notifica al padre si pasa un callback
  };

  return (
    <label className="flex items-center cursor-pointer select-none">
      <span className="mr-3 text-gray-700">{label}</span>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={toggleSwitch}
        />
        <div className="w-11 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-400 transition-colors duration-300"></div>
        <div
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md
                    transition-all duration-300 peer-checked:translate-x-full"></div>
      </div>
    </label>
  );
}
