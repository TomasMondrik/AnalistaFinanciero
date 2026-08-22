import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Análisis Financiero | Terminal de Inversiones',
  description: 'Copiloto de inversiones 24/7 para Merval, CEDEARs y Mercado Internacional',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Análisis Financiero',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-[#070A11] text-slate-100 antialiased font-sans select-none">
        {children}
      </body>
    </html>
  );
}