'use client';

import Link from 'next/link';
import { useAuth } from './lib/authContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { token, role, logout } = useAuth();
  const router = useRouter();

  // Redirigir según el rol si el usuario está autenticado
  useEffect(() => {
    if (token) {
      if (role === 'host') {
        router.push('/my-cars');
      } else if (role === 'guest') {
        router.push('/search');
      }
    }
  }, [token, role, router]);

  return (
    <div className="text-center p-4">
      <h1 className="text-4xl font-bold text-black mb-8">Bienvenido a Redibo</h1>
      {token ? (
        <div className="flex flex-col gap-4">
          <Link href="/my-cars">
            <button className="bg-orange-500 hover:bg-orange-600 text-black text-lg font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300">
              Mis Autos
            </button>
          </Link>
          <button
            onClick={logout}
            className="bg-orange-500 hover:bg-orange-600 text-black text-lg font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Link
            href="/login"
            className="block bg-orange-500 hover:bg-orange-600 text-black text-1xl px-8 py-4 rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            Iniciar sesión
          </Link>
          
        </div>
      )}
    </div>
  );
}