import { NextResponse } from 'next/server';

export async function GET() {
  const now = new Date();
  const formatTime = (minutesAgo: number) => {
    const d = new Date(now.getTime() - minutesAgo * 60000);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const newsData = [
    // --- PESTAÑA: TUS EMPRESAS (type: 'MINE') ---
    {
      id: 'mine-1',
      source: 'El Cronista • Argentina',
      time: formatTime(10),
      elapsed: 'hace 10 min',
      title: 'YPF acelera obras del oleoducto Vaca Muerta Sur para incrementar exportaciones',
      impactTitle: 'Impacto directo en YPFD / PAMP:',
      impactDescription: 'Garantiza mayor capacidad de transporte de crudo y consolida el flujo de caja operativo en dólares.',
      type: 'MINE',
      weight: 10,
      ticker: 'YPFD'
    },
    {
      id: 'mine-2',
      source: 'Wall Street Journal • EE.UU.',
      time: formatTime(25),
      elapsed: 'hace 25 min',
      title: 'NVIDIA recibe nueva demanda masiva de procesadores Blackwell para centros de datos',
      impactTitle: 'Impacto directo en NVDA:',
      impactDescription: 'Sostiene proyecciones de crecimiento en ingresos para el trimestre y reafirma su liderazgo tecnológico.',
      type: 'MINE',
      weight: 9,
      ticker: 'NVDA'
    },
    {
      id: 'mine-3',
      source: 'Bloomberg • Mercados',
      time: formatTime(40),
      elapsed: 'hace 40 min',
      title: 'Pampa Energía confirma avance en la producción de gas para contratos de exportación',
      impactTitle: 'Impacto directo en PAMP:',
      impactDescription: 'Aumento de capacidad entregada en el Plan Gas con tarifas en dólares aseguradas.',
      type: 'MINE',
      weight: 8,
      ticker: 'PAMP'
    },
    {
      id: 'mine-4',
      source: 'Reuters • Tech',
      time: formatTime(60),
      elapsed: 'hace 1 hora',
      title: 'Apple negocia la integración de nuevas soluciones de IA para su próxima actualización de iOS',
      impactTitle: 'Impacto directo en AAPL:',
      impactDescription: 'Potencial catalizador para el recambio global de iPhones durante el próximo semestre.',
      type: 'MINE',
      weight: 8,
      ticker: 'AAPL'
    },

    // --- PESTAÑA: MERCADO GENERAL (type: 'EXPLORE') ---
    {
      id: 'exp-1',
      source: 'Ámbito Financiero • Macro Local',
      time: formatTime(15),
      elapsed: 'hace 15 min',
      title: 'El Contado con Liqui (CCL) opera con leve baja mientras el BCRA suma dólares',
      impactTitle: 'Análisis Tipo de Cambio & CEDEARs:',
      impactDescription: 'La calma cambiaria ajusta temporalmente la cotización en pesos de activos extranjeros como el SPY.',
      type: 'EXPLORE',
      weight: 7,
      ticker: 'CCL'
    },
    {
      id: 'exp-2',
      source: 'CNBC • Macro EE.UU.',
      time: formatTime(35),
      elapsed: 'hace 35 min',
      title: 'La Reserva Federal evalúa la evolución de la inflación antes del próximo movimiento de tasas',
      impactTitle: 'Análisis Tasa Internacional:',
      impactDescription: 'Expectativa de tasas impacta directamente en las valuaciones descontadas de Big Tech en Wall Street.',
      type: 'EXPLORE',
      weight: 7,
      ticker: 'FED'
    },
    {
      id: 'exp-3',
      source: 'MarketWatch • Commodities',
      time: formatTime(80),
      elapsed: 'hace 1h 20m',
      title: 'El barril de Petróleo WTI sostiene el valor por encima de USD 75 impulso por oferta',
      impactTitle: 'Análisis Sector Energía:',
      impactDescription: 'El precio del crudo internacional favorece los balances de las petroleras integradas locales e internacionales.',
      type: 'EXPLORE',
      weight: 6,
      ticker: 'WTI'
    }
  ];

  return NextResponse.json(newsData);
}