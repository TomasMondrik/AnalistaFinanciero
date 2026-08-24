import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  const now = new Date();
  const timeString = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false });

  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json([
        {
          id: 'error-key',
          source: 'Sistema • Estado de API',
          time: timeString,
          elapsed: 'error',
          title: 'Error de Configuración: Falta GEMINI_API_KEY',
          impactTitle: 'Estado del Servicio:',
          impactDescription: 'No se encontró la clave de API en Vercel. Configurá GEMINI_API_KEY en las variables de entorno.',
          type: 'MINE',
          ticker: 'SISTEMA'
        }
      ]);
    }

    const prompt = `
      Buscá y analizá noticias financieras REALES de HOY sobre la economía argentina y Wall Street (S&P Merval, Dólar CCL, YPF, Pampa Energía, Bancos, NVIDIA, Apple, Mercado Libre).

      Generá noticias reales:
      - 1 noticia MACRO RELEVANTE sobre el Dólar CCL / Peso Argentino / Riesgo País (type: "EXPLORE", ticker: "CCL").
      - 3 noticias REALES de empresas o activos clave como YPFD, NVDA, GGAL, PAMP, MELI (type: "MINE").

      Devolvé ÚNICAMENTE un JSON válido con esta estructura exacta:
      [
        {
          "id": "1",
          "source": "El Cronista / Ámbito / Bloomberg / Rava",
          "time": "${timeString}",
          "elapsed": "en vivo",
          "title": "Titular real de hoy",
          "impactTitle": "Impacto directo en TICKER:",
          "impactDescription": "Análisis de 1 o 2 oraciones sobre cómo afecta la cotización.",
          "type": "MINE",
          "ticker": "YPFD"
        }
      ]
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }]
      }
    });

    const newsData = JSON.parse(response.text || '[]');

    if (Array.isArray(newsData) && newsData.length > 0) {
      return NextResponse.json(newsData);
    } else {
      throw new Error('No se devolvieron noticias en el formato esperado.');
    }

  } catch (error: any) {
    console.error('Error al obtener noticias reales:', error);
    
    // Mensaje explícito en lugar de noticias inventadas
    return NextResponse.json([
      {
        id: 'error-fetch',
        source: 'Sistema • Gemini Live Search',
        time: timeString,
        elapsed: 'sin conexión',
        title: 'No se pudieron consultar noticias reales en tiempo real',
        impactTitle: 'Estado de la API:',
        impactDescription: `La búsqueda en vivo de Gemini interrumpió la conexión o no devolvió datos actualizados (${error?.message || 'Error de red'}).`,
        type: 'MINE',
        ticker: 'ALERTA'
      }
    ]);
  }
}