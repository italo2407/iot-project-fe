import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDevices } from '~/contexts/DeviceContext';

const API_URL = import.meta.env.VITE_API_URL;

const SensorConfigForm = () => {
  const { selectedDevice, devices, updateDeviceConfig } = useDevices();
  const selectedDeviceData = devices.find(d => d.device_id === selectedDevice);

  const [formData, setFormData] = useState({
    data_sending_interval: '',
    check_threshold_interval: '',
    temp_threshold_max: '',
    ppm_threshold_max: '',
  });

  const prevSelectedDevice = useRef<string | null>(null);

  // Sincroniza formData con selectedDeviceData
  useEffect(() => {
    if (
      prevSelectedDevice.current !== selectedDevice &&
      selectedDeviceData?.config
    ) {
      setFormData({
        data_sending_interval: String(
          selectedDeviceData.config.data_sending_interval ?? ''
        ),
        check_threshold_interval: String(
          selectedDeviceData.config.check_threshold_interval ?? ''
        ),
        temp_threshold_max: String(
          selectedDeviceData.config.temp_threshold_max ?? ''
        ),
        ppm_threshold_max: String(
          selectedDeviceData.config.ppm_threshold_max ?? ''
        ),
      });
    }
    prevSelectedDevice.current = selectedDevice;
  }, [selectedDeviceData, selectedDeviceData?.config]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      data_sending_interval: Number(formData.data_sending_interval),
      check_threshold_interval: Number(formData.check_threshold_interval),
      temp_threshold_max: Number(formData.temp_threshold_max),
      ppm_threshold_max: Number(formData.ppm_threshold_max),
    };

    try {
      const res = await fetch(`${API_URL}/devices/${selectedDevice}/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error en la respuesta del servidor');

      const result = await res.json();
      console.log('Configuración enviada:', result);

      toast.success(`${selectedDevice} configuración actualizada.`, {
        style: {
          border: '1px solid #61d345',
        },
      });

      updateDeviceConfig(selectedDevice, payload);
    } catch (error) {
      console.error('Error al enviar la configuración:', error);
      toast.error(
        `Hubo error al momento de acutalizar la config de ${selectedDevice}.`,
        {
          style: {
            border: '1px solid #ff4b4b',
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-4 items-center">
        <label
          htmlFor="data_sending_interval"
          className="block text-sm font-medium text-gray-700 flex-2">
          Intervalo de envío (miliseg) <br />
          <span className="text-xs text-gray-500">
            Intervalo en el que el dispositivo envía datos al servidor
          </span>
        </label>
        <input
          type="number"
          id="data_sending_interval"
          name="data_sending_interval"
          value={formData.data_sending_interval}
          onChange={handleChange}
          className="text-sm mt-1 block w-full rounded-md border border-gray-200 focus:ring-blue-500 focus:border-blue-500 p-2 flex-1"
          required
        />
      </div>

      <div className="flex gap-4 items-center">
        <label
          htmlFor="check_threshold_interval"
          className="block text-sm font-medium text-gray-700 flex-2">
          Intervalo de verificación (miliseg) <br />
          <span className="text-xs text-gray-500">
            Intervalo en el que el dispositivo verifica los umbrales
          </span>
        </label>
        <input
          type="number"
          id="check_threshold_interval"
          name="check_threshold_interval"
          value={formData.check_threshold_interval}
          onChange={handleChange}
          className="text-sm mt-1 block w-full rounded-md border border-gray-200 focus:ring-blue-500 focus:border-blue-500 p-2 flex-1"
          required
        />
      </div>

      <div className="flex gap-4 items-center">
        <label
          htmlFor="temp_threshold_max"
          className="block text-sm font-medium text-gray-700 flex-2">
          Temperatura máxima (°C) <br />
          <span className="text-xs text-gray-500">
            Umbral máximo de temperatura para activar alertas
          </span>
        </label>
        <input
          type="number"
          id="temp_threshold_max"
          name="temp_threshold_max"
          value={formData.temp_threshold_max}
          onChange={handleChange}
          className="text-sm mt-1 block w-full rounded-md border border-gray-200 focus:ring-blue-500 focus:border-blue-500 p-2 flex-1"
          required
        />
      </div>

      <div className="flex gap-4 items-center mb-8">
        <label
          htmlFor="ppm_threshold_max"
          className="block text-sm font-medium text-gray-700 flex-2">
          PPM máximo <br />
          <span className="text-xs text-gray-500">
            Umbral máximo de PPM de CO2 para activar alertas
          </span>
        </label>
        <input
          type="number"
          id="ppm_threshold_max"
          name="ppm_threshold_max"
          value={formData.ppm_threshold_max}
          onChange={handleChange}
          className="text-sm mt-1 block w-full rounded-md border border-gray-200 focus:ring-blue-500 focus:border-blue-500 p-2 flex-1"
          required
        />
      </div>

      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="text-end py-2 px-4 bg-blue-600 text-white font-medium text-sm rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

export default SensorConfigForm;
