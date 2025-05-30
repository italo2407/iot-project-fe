// src/components/UserDropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faChartPie,
  faCog,
  faQuestionCircle,
  faSignOutAlt,
  faChevronDown,
} from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '~/contexts/AuthContext';

const UserDropdown = () => {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center space-x-2 focus:outline-none">
        <img
          src={user.picture}
          alt="profile"
          className="w-8 h-8 rounded-full"
        />
        <span className="text-sm text-gray-800 font-light">{user.name}</span>
        <FontAwesomeIcon icon={faChevronDown} className="text-gray-500" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg z-50">
          <div className="py-2">
            <button
              onClick={signOut}
              className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left">
              <FontAwesomeIcon icon={faSignOutAlt} className="w-4 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
