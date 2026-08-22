import { NextResponse } from 'next/server';

export async function GET() {
  const news = [
    {
      id: '1',
      source: 'Reuters • EE.UU.',
      time: '11:48 AM',
      elapsed: 'hace 18 min',
      title: 'La Reserva Federal sugiere mantener la tasa de interés en el corto plazo',
      impactTitle: 'Por qué afecta a tu portfolio:',
      impactDescription: 'Impacta en la cotización de tus CEDEARs tecnológicos (AAPL, GOOGL, NVDA) por ajuste de tasa de descuento.',
      type: 'MINE',
      weight: 8
    },
    {
      id: '2',
      source: 'El Cronista • Argentina',
      time: '10:15 AM',
      elapsed: 'hace 1h 51m',
      title: 'Nuevos récords de transporte de crudo en Vaca Muerta',
      impactTitle: 'Por qué afecta a tu portfolio:',
      impactDescription: 'Noticia favorable para YPFD y PAMP. Fortalece la proyección de generación de caja.',
      type: 'MINE',
      weight: 7
    },
    {
      id: '3',
      source: 'Bloomberg • Internacional',
      time: '06:15 AM',
      elapsed: 'hace 5h 51m',
      title: 'Conflicto en Medio Oriente presiona el precio internacional del petróleo WTI (+4.8%)',
      impactTitle: 'Análisis Energéticas:',
      impactDescription: 'Noticia de la madrugada con máximo impacto macro. Dispara valuaciones en empresas productoras de crudo.',
      isCritical: true,
      type: 'EXPLORE',
      weight: 10
    }
  ];

  const sortedNews = news.sort((a, b) => b.weight - a.weight);
  return NextResponse.json(sortedNews);
}