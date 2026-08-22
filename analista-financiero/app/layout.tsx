import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Análisis Financiero',
  description: 'Copiloto de inversiones 24/7 para Merval, CEDEARs y Mercado Internacional',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </head>
      <body className="bg-[#090D16] text-slate-100 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}