import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from './lib/authContext';
import Header from './components/Header';

export const metadata: Metadata = {
  title: 'Redibo',
  description: 'Plataforma de alquiler de autos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1 flex items-center justify-center">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}