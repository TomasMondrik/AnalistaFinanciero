import { NextResponse } from 'next/server';

export async function GET() {
  // Hora actual de Argentina
  const now = new Date();
  const formatTime = (minutesAgo: number) => {
    const d = new Date(now.getTime() - minutesAgo * 60000);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const newsData = [
    // --- TUS EMPRESAS (Pestaña "Tus Empresas") ---
    {
      id: '1',
      source: 'El Cronista • Argentina',
      time: formatTime(15),
      elapsed: 'hace 15 min',
      title: 'YPF amplía la capacidad de transporte de crudo desde Vaca Muerta',
      impactTitle: 'Impacto directo en YPFD / PAMP:',
      impactDescription: 'Mejora los volúmenes de evacuación y acelera la generación de flujo de caja libre en dólares.',
      type: 'MINE',
      weight: 10,
      ticker: 'YPFD'
    },
    {
      id: '2',
      source: 'Wall Street Journal • EE.UU.',
      time: formatTime(32),
      elapsed: 'hace 32 min',
      title: 'NVIDIA anuncia nuevo chip H200 enfocado en eficiencia energética de Datacenters',
      impactTitle: 'Impacto directo en NVDA:',
      impactDescription: 'Sostiene el monopolio en infraestructura de IA y mantiene proyecciones de márgenes brutos por encima del 70%.',
      type: 'MINE',
      weight: 9,
      ticker: 'NVDA'
    },
    {
      id: '3',
      source: 'Bloomberg • Mercados',
      time: formatTime(50),
      elapsed: 'hace 50 min',
      title: 'Pampa Energía reporta incremento del 14% en producción de gas natural',
      impactTitle: 'Impacto directo en PAMP:',
      impactDescription: 'Mayor volumen colocado en Plan Gas a tarifas consolidadas. Favorable para el balance del trimestre.',
      type: 'MINE',
      weight: 8,
      ticker: 'PAMP'
    },
    {
      id: '4',
      source: 'CNBC • Tech',
      time: formatTime(75),
      elapsed: 'hace 1h 15m',
      title: 'Apple negocia alianza clave para integrar nuevos modelos de IA en iOS',
      impactTitle: 'Impacto directo en AAPL:',
      impactDescription: 'Catalizador de renovación de dispositivos para el próximo ciclo de ventas.',
      type: 'MINE',
      weight: 8,
      ticker: 'AAPL'
    },

    // --- MERCADO GENERAL (Pestaña "Mercado General") ---
    {
      id: '5',
      source: 'Ámbito Financiero • Macro',
      time: formatTime(20),
      elapsed: 'hace 20 min',
      title: 'El Contado con Liqui (CCL) opera estable mientras el BCRA suma reservas',
      impactTitle: 'Impacto Macro / CEDEARs:',
      impactDescription: 'La estabilidad cambiaria reduce la volatilidad en pesos del SPY y de las acciones extranjeras.',
      type: 'EXPLORE',
      weight: 7,
      ticker: 'CCL'
    },
    {
      id: '6',
      source: 'Reuters • Internacional',
      time: formatTime(110),
      elapsed: 'hace 1h 50m',
      title: 'La Reserva Federal señala prudencia con la baja de tasas de interés',
      impactTitle: 'Impacto Tasa EE.UU.:',
      impactDescription: 'Afecta la tasa de descuento de las tecnológicas globales en el S&P 500.',
      type: 'EXPLORE',
      weight: 7,
      ticker: 'FED'
    }
  ];

  return NextResponse.json(newsData);
}