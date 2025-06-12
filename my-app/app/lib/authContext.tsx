'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  token: string | null;
  role: string | null; // Nuevo: Agregamos el rol
  login: (token: string, userRole: string) => void; // Actualizamos login para incluir el rol
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Nuevo: Estado para el rol
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role'); // Nuevo: Obtenemos el rol del localStorage
    if (storedToken) {
      setToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  const login = (newToken: string, userRole: string) => {
    setToken(newToken);
    setRole(userRole); // Nuevo: Guardamos el rol
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', userRole); // Nuevo: Guardamos el rol en localStorage
  };

  const logout = () => {
    setToken(null);
    setRole(null); // Nuevo: Limpiamos el rol
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Nuevo: Eliminamos el rol del localStorage
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}