import { useState } from 'react';
import { useDevices } from '~/contexts/DeviceContext';
import DynamicSelect from './DynamicSelect';

export type LogFilters = {
  from?: string;
  to?: string;
  device_id?: string;
  type?: string;
};

type LogFilterProps = {
  onFilter: (filter: LogFilters) => void;
};

export default function LogFilter({ onFilter }: LogFilterProps) {
  const { devices } = useDevices();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [device, setDevice] = useState('');
  const [type, setType] = useState('');

  const handleFilter = () => {
    onFilter({
      from,
      to,
      device_id: device,
      type,
    });
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
      {/* Device */}
      <DynamicSelect
        options={devices.map(device => ({
          value: device.device_id,
          label: device.device_id,
        }))}
        placeholder="Selecciona un dispositivo"
        onChange={setDevice}
        label="Dispositivos"
        direction="col"
        value={device}
      />

      {/* Tipo de Log */}
      <DynamicSelect
        options={[
          { value: '', label: 'Todos' },
          { value: 'INFO', label: 'INFO' },
          { value: 'WARNING', label: 'WARNING' },
          { value: 'ERROR', label: 'ERROR' },
        ]}
        onChange={setType}
        label="Tipo de log"
        direction="col"
        value={type}
      />

      {/* Fecha Desde */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-700">Desde</label>
        <input
          type="datetime-local"
          value={from}
          onChange={e => setFrom(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
        />
      </div>

      {/* Fecha Hasta */}
      <div className="flex flex-col">
        <label className="text-sm text-gray-700">Hasta</label>
        <input
          type="datetime-local"
          value={to}
          onChange={e => setTo(e.target.value)}
          className="border border-gray-300 rounded px-3 py-2 text-sm bg-white"
        />
      </div>

      {/* Botón Filtrar */}
      <div className="flex items-end">
        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded">
          Filtrar
        </button>
      </div>
    </div>
  );
}
