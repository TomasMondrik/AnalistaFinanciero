import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  const now = new Date();
  const formatTime = (minutesAgo: number) => {
    const d = new Date(now.getTime() - minutesAgo * 60000);
    return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Titulares recientes para analizar por IA
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
    // Si hay clave de Gemini, procesamos con IA Real
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un analista financiero experto en el mercado argentino (Merval, CEDEARs, Bonos).
        Analizá estos titulares y devolvé UNICAMENTE un JSON válido con esta estructura exacta para cada uno:
        [
          {
            "id": "id del articulo",
            "impactTitle": "Título corto de impacto (ej: Impacto directo en YPFD:)",
            "impactDescription": "Análisis cuantitativo de 1 o 2 oraciones sobre el efecto en la cotización.",
            "upside": "Ej: +25% Suba Proyectada o Impacto Neutro",
            "action": "Mantener, Proteger Ganancia o Vender"
          }
        ]

        Titulares a analizar:
        ${JSON.stringify(rawArticles)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const aiAnalysis = JSON.parse(response.text || '[]');

      // Combinar datos del titular con la respuesta de la IA
      const enrichedNews = rawArticles.map((article) => {
        const analysis = aiAnalysis.find((a: any) => a.id === article.id) || {};
        return {
          ...article,
          elapsed: 'en vivo (IA)',
          impactTitle: analysis.impactTitle || 'Impacto Estimado:',
          impactDescription: analysis.impactDescription || 'Análisis en proceso por el motor financiero.',
          upside: analysis.upside || 'En revisión',
          action: analysis.action || 'Mantener'
        };
      });

      return NextResponse.json(enrichedNews);
    }
  } catch (error) {
    console.error('Error procesando con Gemini:', error);
  }

  // Fallback si no hay clave configurada
  return NextResponse.json(rawArticles);
}