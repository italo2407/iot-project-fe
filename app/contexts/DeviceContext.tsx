import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL;

type Device = {
  device_id: string;
  status: string;
  network_info: {
    ip: string;
    mac: string;
    ssid: string;
  };
  temperature: number;
  humidity: number;
  ppm: number;
  fan: boolean;
  light: boolean;
  createdAt?: string;
  updatedAt?: string;
  config: {
    data_sending_interval: number;
    check_threshold_interval: number;
    temp_threshold_max: number;
    ppm_threshold_max: number;
  };
};

type DeviceContextType = {
  devices: Device[];
  loading: boolean;
  selectedDevice: string;
  setSelectedDevice: (deviceId: string) => void;
  refreshDevices: () => void;
  updateDeviceConfig: (deviceId: string, config: Device['config']) => void;
};

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<string>('');

  const fetchDevices = () => {
    setLoading(true);
    fetch(`${API_URL}/devices`)
      .then(res => res.json())
      .then(data => setDevices(data))
      .catch(() => setDevices([]))
      .finally(() => setLoading(false));
  };

  const updateDeviceConfig = (deviceId: string, config: Device['config']) => {
    setDevices(prev =>
      prev.map(device =>
        device.device_id === deviceId ? { ...device, config } : device
      )
    );
  };

  useEffect(() => {
    fetchDevices();

    const sse = new EventSource(`${API_URL}/devices/events/status`);

    sse.onmessage = event => {
      console.log('New device event:', event);
      const newDevice = JSON.parse(event.data);
      console.log('Parsed device:', newDevice);
      setDevices(prevDevices => {
        const exists = prevDevices.some(
          d => d.device_id === newDevice.device_id
        );
        if (!exists) {
          toast.success(`Nuevo dispositvo conectado ${newDevice.device_id}`, {
            style: {
              border: '1px solid #61d345',
            },
          });
          return [
            {
              ...newDevice,
              temperature: 0,
              humidity: 0,
              ppm: 0,
              fan: false,
              light: false,
            },
            ...prevDevices,
          ];
        }

        if (newDevice.status === 'OFF') {
          toast.error(`${newDevice.device_id} se ha desconectado.`, {
            style: {
              border: '1px solid #ff4b4b',
            },
          });
        } else {
          toast.success(`${newDevice.device_id} se ha conecteado.`, {
            style: {
              border: '1px solid #61d345',
            },
          });
        }

        return prevDevices.map(device =>
          device.device_id === newDevice.device_id
            ? { ...device, ...newDevice }
            : device
        );
      });
    };

    // SSE para datos de sensores
    const sseData = new EventSource(`${API_URL}/devices/events/data`);
    sseData.onmessage = event => {
      const sensorData = JSON.parse(event.data);
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.device_id === sensorData.device_id
            ? { ...device, ...sensorData }
            : device
        )
      );
    };

    // SSE para leer estado de los actuadores
    const sseActuator = new EventSource(`${API_URL}/devices/events/actuators`);
    sseActuator.onmessage = event => {
      const data = JSON.parse(event.data);
      setDevices(prevDevices =>
        prevDevices.map(device =>
          device.device_id === data.device_id
            ? { ...device, [data.actuatorType]: data.status }
            : device
        )
      );
    };

    sseActuator.onerror = err => {
      console.error('SSE Fan Error', err);
      //sseActuator.close();
    };

    sseData.onerror = err => {
      console.error('SSE Data Error', err);
      //sseData.close();
    };

    sse.onerror = err => {
      console.error('SSE Error', err);
      //sse.close();
    };

    return () => {
      sse.close();
      sseData.close();
      sseActuator.close();
    };
  }, []);

  // Selecciona el primer device por defecto cuando devices cambia
  useEffect(() => {
    if (devices.length > 0 && !selectedDevice) {
      setSelectedDevice(devices[0].device_id);
    }
  }, [devices, selectedDevice]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        loading,
        selectedDevice,
        setSelectedDevice,
        refreshDevices: fetchDevices,
        updateDeviceConfig: updateDeviceConfig,
      }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (!context)
    throw new Error('useDevices debe usarse dentro de un DeviceProvider');
  return context;
};
