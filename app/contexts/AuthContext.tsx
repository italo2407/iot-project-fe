import React, { createContext, useContext, useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

interface AuthContextType {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  signInWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const signInWithGoogle = async () => {
    window.location.href = `${API_URL}/api/auth/google`; // Redirige a tu NestJS auth endpoint
  };

  const signOut = () => {
    localStorage.removeItem('authToken'); // Limpia el token de autenticación
    setUser(null);
  };

  useEffect(() => {
    console.log('useEffect running');
    // Puedes usar cookies o token en localStorage para recuperar el usuario
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const res = await fetch(`${API_URL}/api/auth/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log('User data:', data);
          if (data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signInWithGoogle, signOut, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};
