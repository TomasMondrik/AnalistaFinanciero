import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  const now = new Date();
  const formatTime = (minutesAgo: number) => {
    const d = new Date(now.getTime() - minutesAgo * 60000);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const rawArticles = [
    {
      id: '1',
      source: 'El Cronista • Argentina',
      time: formatTime(10),
      title: 'YPF acelera las obras de infraestructura en Vaca Muerta para elevar exportaciones de crudo',
      ticker: 'YPFD',
      type: 'MINE'
    },
    {
      id: '2',
      source: 'Bloomberg • Wall Street',
      time: formatTime(25),
      title: 'NVIDIA reporta una sólida demanda de chips Blackwell para centros de datos de IA',
      ticker: 'NVDA',
      type: 'MINE'
    },
    {
      id: '3',
      source: 'Ámbito Financiero • Macro Local',
      time: formatTime(15),
      title: 'El dólar Contado con Liqui (CCL) opera con leve baja por acumulación de reservas del BCRA',
      ticker: 'CCL',
      type: 'EXPLORE'
    }
  ];

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un analista financiero. Analizá estos titulares y devolvé UNICAMENTE un JSON válido con este formato para cada uno:
        [
          {
            "id": "1",
            "impactTitle": "Impacto directo en YPFD / PAMP:",
            "impactDescription": "Explicación breve de 1 o 2 oraciones sobre cómo afecta la cotización."
          }
        ]

        Titulares:
        ${JSON.stringify(rawArticles)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const aiAnalysis = JSON.parse(response.text || '[]');

      const enrichedNews = rawArticles.map((article) => {
        const analysis = aiAnalysis.find((a: any) => a.id === article.id) || {};
        return {
          ...article,
          elapsed: 'en vivo',
          impactTitle: analysis.impactTitle || `Análisis en Vivo (${article.ticker}):`,
          impactDescription: analysis.impactDescription || 'Sostenimiento de volumen proyectado y catalizadores operativos en desarrollo.'
        };
      });

      return NextResponse.json(enrichedNews);
    }
  } catch (error) {
    console.error('Error con Gemini en Noticias:', error);
  }

  // Fallback seguro si falla la IA
  return NextResponse.json([
    {
      id: '1',
      source: 'El Cronista • Argentina',
      time: formatTime(10),
      elapsed: 'en vivo',
      title: 'YPF acelera las obras de infraestructura en Vaca Muerta para elevar exportaciones de crudo',
      impactTitle: 'Impacto directo en YPFD / PAMP:',
      impactDescription: 'Mejora la capacidad de evacuación de crudo y consolida el flujo de caja operativo en dólares.',
      type: 'MINE',
      ticker: 'YPFD'
    },
    {
      id: '2',
      source: 'Bloomberg • Wall Street',
      time: formatTime(25),
      elapsed: 'en vivo',
      title: 'NVIDIA reporta una sólida demanda de chips Blackwell para centros de datos de IA',
      impactTitle: 'Impacto directo en NVDA:',
      impactDescription: 'Sostiene proyecciones de crecimiento en ingresos para el trimestre y reafirma su liderazgo tecnológico.',
      type: 'MINE',
      ticker: 'NVDA'
    },
    {
      id: '3',
      source: 'Ámbito Financiero • Macro Local',
      time: formatTime(15),
      elapsed: 'en vivo',
      title: 'El dólar Contado con Liqui (CCL) opera con leve baja por acumulación de reservas del BCRA',
      impactTitle: 'Análisis Tipo de Cambio & CEDEARs:',
      impactDescription: 'La calma cambiaria ajusta temporalmente la cotización en pesos de activos extranjeros como el SPY.',
      type: 'EXPLORE',
      ticker: 'CCL'
    }
  ]);
}