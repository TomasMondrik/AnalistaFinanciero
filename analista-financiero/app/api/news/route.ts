import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un analista financiero en tiempo real. Generá 4 noticias breves e importantes del mercado financiero actual (Merval, Dólar CCL, CEDEARs de Wall Street como NVDA, YPFD, PAMP, GGAL, AAPL, etc.).
        
        Suministrá 2 noticias de empresas individuales (type: "MINE") y 2 noticias del mercado general o macroeconomía (type: "EXPLORE").
        
        Devolvé ÚNICAMENTE un JSON válido con esta estructura exacta:
        [
          {
            "id": "1",
            "source": "El Cronista / Bloomberg / Ámbito",
            "time": "${timeString}",
            "elapsed": "en vivo",
            "title": "Titular conciso y relevante",
            "impactTitle": "Impacto directo en TICKER:",
            "impactDescription": "Análisis de 1 o 2 oraciones sobre el efecto en la cotización.",
            "type": "MINE",
            "ticker": "YPFD"
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const newsData = JSON.parse(response.text || '[]');
      return NextResponse.json(newsData);
    }
  } catch (error) {
    console.error('Error generando noticias con Gemini:', error);
  }

  // Fallback seguro si falla la API
  return NextResponse.json([
    {
      id: '1',
      source: 'Mercado Argentina',
      time: timeString,
      elapsed: 'en vivo',
      title: 'Monitoreo de volatilidad en activos locales e internacionales',
      impactTitle: 'Análisis de Cartera:',
      impactDescription: 'Sostenimiento de volumen en activos clave del mercado.',
      type: 'MINE',
      ticker: 'YPFD'
    }
  ]);
}