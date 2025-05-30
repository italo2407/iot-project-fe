import {
  faChartPie,
  faRectangleList,
  faTachometerAlt,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { NavLink } from 'react-router';

const Sidenav = () => {
  return (
    <div className="hidden w-1/6 flex-shrink-0 lg:flex bg-blue-custom">
      <div className="flex h-full w-full flex-col">
        <a className="sidebar-brand" href="/">
          <img width={48} src="/assets/iot-logo.svg" alt="Logo" />{' '}
          <span className="align-middle me-3">IoT Platform</span>
        </a>
        <NavLink
          to="/app"
          end
          className={({ isActive }) =>
            isActive
              ? 'flex gap-4 items-center text-blue-custom py-4 px-8 text-sm font-light'
              : 'flex gap-4 items-center text-slate-200 py-4 px-8 text-sm font-light'
          }>
          <FontAwesomeIcon icon={faChartPie} className="mr-2" />
          Dashboard
        </NavLink>
        <NavLink
          to="/app/logs"
          className={({ isActive }) =>
            isActive
              ? 'flex gap-4 items-center text-blue-custom py-4 px-8 text-sm font-light'
              : 'flex gap-4 items-center text-slate-200 py-4 px-8 text-sm font-light'
          }>
          <FontAwesomeIcon icon={faRectangleList} className="mr-2" />
          Logs
        </NavLink>
      </div>
    </div>
  );
};
export default Sidenav;
