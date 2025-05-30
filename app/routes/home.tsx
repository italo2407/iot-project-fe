import type { Route } from './+types/home';
import { useDevices } from '~/contexts/DeviceContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCode } from '@fortawesome/free-regular-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import Devices from './Devices';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  const { devices, loading } = useDevices();
  const connectedDevices = devices.filter(device => device.status === 'ON');
  if (loading) {
    return <div>Cargando dispositivos...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Dashboard</h1>
      <p className="font-light mb-8">Welcome to the IoT Platform!</p>

      {connectedDevices.length === 0 && (
        <div className="text-center">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-9xl text-slate-200"></FontAwesomeIcon>
          <h2 className="mt-8 font-light text-lg">
            No existen dispositivos conectados
          </h2>
          <p className="mt-4"></p>
        </div>
      )}

      {connectedDevices.length > 0 && <Devices />}
    </div>
  );
}
