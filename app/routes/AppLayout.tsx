import { Toaster } from 'react-hot-toast';
import { Outlet, Navigate } from 'react-router';
import Sidenav from '~/components/Sidenav';
import UserDropdown from '~/components/Userdropdown';
import { useAuth } from '~/contexts/AuthContext';

export default function AppLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Cargando...</div>; // spinner, splash, etc.
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="flex h-screen flex-col bg-white text-body dark:bg-dark-14 dark:text-dark-body">
      <div
        className="flex-grow overflow-auto"
        style={{ backgroundColor: 'rgb(247, 249, 252)' }}>
        <div className="flex h-full">
          <Sidenav />
          <main className="flex w-full flex-col overflow-auto flex-col">
            <nav className="navbar bg-white flex items-center py-4 px-8 justify-end">
              <UserDropdown />
            </nav>
            <div className="p-8">
              <Outlet />
            </div>
            <div>
              <Toaster position="top-right" reverseOrder={false} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
