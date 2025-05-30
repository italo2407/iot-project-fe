import {
  faClockRotateLeft,
  faGlobe,
  faWifi,
} from '@fortawesome/free-solid-svg-icons';
import DeviceInfoCard from '~/components/DeviceInfoCard';
import DynamicSelect from '~/components/DynamicSelect';
import type { GaugeChartLimitData } from '~/components/GaugeChart';
import GaugeChartCard from '~/components/GaugeChartCard';
import { useDevices } from '~/contexts/DeviceContext';
import { format } from 'date-fns';
import Switch from '~/components/Switch';
import SensorConfigForm from '~/components/SensorConfigForm';

const temperatureData: GaugeChartLimitData[] = [
  {
    limit: 10,
    color: '#EA4228',
    showTick: true,
    tooltip: {
      text: 'Too low temperature!',
    },
  },
  {
    limit: 17,
    color: '#F5CD19',
    showTick: true,
    tooltip: {
      text: 'Low temperature!',
    },
  },
  {
    limit: 28,
    color: '#5BE12C',
    showTick: true,
    tooltip: {
      text: 'OK temperature!',
    },
  },
  {
    limit: 30,
    color: '#F5CD19',
    showTick: true,
    tooltip: {
      text: 'High temperature!',
    },
  },
  {
    color: '#EA4228',
    tooltip: {
      text: 'Too high temperature!',
    },
  },
];

const humedadData: GaugeChartLimitData[] = [
  {
    limit: 30,
    color: '#EA4228',
    showTick: true,
    tooltip: {
      text: 'Ambiente muy seco!',
    },
  },
  {
    limit: 45,
    color: '#F5CD19',
    showTick: true,
    tooltip: {
      text: 'Ambiente seco',
    },
  },
  {
    limit: 60,
    color: '#5BE12C',
    showTick: true,
    tooltip: {
      text: 'Ambiente Ideal',
    },
  },
  {
    limit: 75,
    color: '#F5CD19',
    showTick: true,
    tooltip: {
      text: 'Ambiente húmedo',
    },
  },
  {
    color: '#EA4228',
    tooltip: {
      text: 'Ambiente muy húmedo',
    },
  },
];

const ppmData = [
  {
    limit: 200,
    color: '#5BE12C',
    showTick: true,
    tooltip: {
      text: 'Aire limpio',
    },
  },
  {
    limit: 533,
    color: '#F5CD19',
    showTick: true,
    tooltip: {
      text: 'Aire ligeramente contaminado',
    },
  },
  {
    limit: 800,
    color: '#f17d40',
    showTick: true,
    tooltip: {
      text: 'Aire contaminado',
    },
  },
  {
    color: '#EA4228',
    tooltip: {
      text: 'Aire muy contaminado',
    },
  },
];

const actuadores = [
  {
    name: 'Ventilador',
    type: 'fan',
    icon: 'faFan',
    description: 'Controla el ventilador del dispositivo',
  },
  {
    name: 'Alarma',
    type: 'light',
    icon: 'faBell',
    description: 'Activa la alarma del dispositivo',
  },
];

const Devices = () => {
  const { devices, selectedDevice, setSelectedDevice } = useDevices();
  const selectedDeviceData = devices.find(d => d.device_id === selectedDevice);

  const handleActuatorChange = async (type: string, value: boolean) => {
    if (!selectedDeviceData) return;
    try {
      await fetch(
        `${import.meta.env.VITE_API_URL}/devices/${selectedDeviceData.device_id}/actuator`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            actuator: type,
            command: value ? 'ON' : 'OFF',
          }),
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <DynamicSelect
        options={devices
          .filter(item => item.status === 'ON')
          .map(device => ({
            value: device.device_id,
            label: device.device_id,
          }))}
        placeholder="Selecciona un dispositivo"
        onChange={setSelectedDevice}
        label="Dispositivos conectados"
        direction="row"
        value={selectedDevice}
      />
      {selectedDeviceData && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <DeviceInfoCard
              label="WiFi"
              value={selectedDeviceData?.network_info.ssid || ''}
              icon={faWifi}
            />
            {selectedDeviceData?.updatedAt && (
              <DeviceInfoCard
                icon={faClockRotateLeft}
                label="Última conexión"
                value={format(
                  new Date(selectedDeviceData?.updatedAt || ''),
                  'dd/MM/yyyy HH:mm'
                )}
              />
            )}
            <DeviceInfoCard
              icon={faGlobe}
              label="Dirección IP"
              value={selectedDeviceData?.network_info.ip || ''}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            <GaugeChartCard
              title="Temperatura"
              data={temperatureData}
              value={selectedDeviceData?.temperature || 0}
              units="°C"
              minValue={0}
              maxValue={35}
            />
            <GaugeChartCard
              title="Humedad"
              data={humedadData}
              value={selectedDeviceData?.humidity || 0}
              units="%"
              minValue={0}
              maxValue={100}
            />
            <GaugeChartCard
              title="PPM CO2"
              data={ppmData}
              value={selectedDeviceData?.ppm || 0}
              units=""
              minValue={0}
              maxValue={1000}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mt-8">
            <div>
              <div className="bg-white shadow-custom rounded-lg flex flex-col justify-between p-4 mb-8">
                <h2 className="text-xl font-semibold mb-4">Actuadores</h2>
                {actuadores.map(actuador => (
                  <div
                    key={actuador.name}
                    className="flex items-center justify-between mb-4 border-b pb-4 last:border-0 last:pb-0 border-gray-300">
                    <div>
                      <h3 className="font-medium text-sm text-gray-700">
                        {actuador.name}
                      </h3>
                      <p className="text-xs font-medium text-gray-500">
                        {actuador.description}
                      </p>
                    </div>
                    <Switch
                      defaultChecked={
                        selectedDeviceData[
                          actuador.type as keyof typeof selectedDeviceData
                        ] as boolean
                      }
                      onChange={checked =>
                        handleActuatorChange(actuador.type, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white shadow-custom rounded-lg flex flex-col justify-between p-4 mb-8">
              <h2 className="text-xl font-semibold mb-4">Configuración</h2>
              <SensorConfigForm />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Devices;
