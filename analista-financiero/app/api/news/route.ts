import { NextResponse } from 'next/server';

export async function GET() {
  // Lista de empresas y variables macro permitidas
  const ALLOWED_KEYWORDS = [
    'ypf', 'pampa', 'pamp', 'ternium', 'txar', 'merval', 'cedear', 'cedears',
    'apple', 'aapl', 'nvidia', 'nvda', 'google', 'googl', 'amazon', 'amzn',
    'spy', 's&p 500', 'fed', 'reserva federal', 'petroleo', 'wti', 'brent',
    'dolar ccl', 'dolar mep', 'vaca meerta', 'rigetti', 'rgti'
  ];

  // Feed de noticias enfocado exclusivamente en mercado y empresas operables
  const rawFinancialNews = [
    {
      id: Date.now().toString(),
      source: 'El Cronista • Argentina',
      time: 'Hace 12 min',
      elapsed: 'En vivo',
      title: 'YPF acelera desembolsos en Vaca Muerta y consolida flujo para exportación',
      impactTitle: 'Impacto directo en YPFD / PAMP:',
      impactDescription: 'Aumento de capacidad operativa. Noticia positiva para los márgenes en dólares de energéticas locales.',
      type: 'MINE',
      weight: 10,
      isCritical: true,
      ticker: 'YPFD'
    },
    {
      id: (Date.now() + 1).toString(),
      source: 'Bloomberg • Wall Street',
      time: 'Hace 28 min',
      elapsed: 'En vivo',
      title: 'NVIDIA muestra demanda sostenida de microprocesadores para datacenters',
      impactTitle: 'Impacto CEDEAR NVDA:',
      impactDescription: 'Sostiene proyecciones de balance sobre el sector semiconductores en Wall Street.',
      type: 'MINE',
      weight: 9,
      isCritical: false,
      ticker: 'NVDA'
    },
    {
      id: (Date.now() + 2).toString(),
      source: 'Ámbito Financiero • Macro',
      time: 'Hace 45 min',
      elapsed: 'En vivo',
      title: 'El CCL cede mientras el BCRA continúa la acumulación de reservas',
      impactTitle: 'Impacto Brecha & CEDEARs:',
      impactDescription: 'La baja temporal del contado con liqui ajusta cotizaciones en pesos de activos del exterior.',
      type: 'EXPLORE',
      weight: 8,
      isCritical: false,
      ticker: 'CCL'
    },
    {
      id: (Date.now() + 3).toString(),
      source: 'Reuters • Internacional',
      time: 'Hace 1h 10m',
      elapsed: 'En vivo',
      title: 'Petróleo WTI rebota tras tensiones en Medio Oriente y sostiene a las petroleras',
      impactTitle: 'Impacto Macro Energético:',
      impactDescription: 'Suba de crudo internacional beneficia valuaciones de balances del sector energético.',
      type: 'MINE',
      weight: 8,
      isCritical: false,
      ticker: 'YPFD'
    }
  ];

  // Filtro estricto: solo pasan noticias que toquen empresas cotizantes o variables macro
  const filteredNews = rawFinancialNews.filter(article => {
    const contentToSearch = `${article.title} ${article.impactDescription}`.toLowerCase();
    return ALLOWED_KEYWORDS.some(keyword => contentToSearch.includes(keyword));
  });

  return NextResponse.json(filteredNews);
}