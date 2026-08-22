import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un analista cuantitativo Senior. 
        Analizá el mercado financiero actual (Merval, CEDEARs de Wall Street y Bonos Argentinos).
        Elegí 3 activos DISTINTOS y atractivos para el día de hoy (pueden ser de tech, energía, bancos, o bonos como BMA, GGAL, AAPL, AMZN, MSFT, YPFD, TXAR, AL30, GD30, etc.).
        
        IMPORTANTE: Varía la selección en cada llamada. No sugieras siempre los mismos 3 activos.

        Devolvé ÚNICAMENTE un JSON válido con este formato:
        [
          {
            "ticker": "TICKER",
            "name": "Nombre completo",
            "catalyst": "Catalizador breve",
            "target": "+XX.X% Suba Proyectada",
            "status": "Alta Convicción / Value Play / Riesgo Alto",
            "thesis": "Breve explicación táctica de 2 oraciones."
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const opportunities = JSON.parse(response.text || '[]');
      return NextResponse.json(opportunities);
    }
  } catch (error) {
    console.error('Error con Gemini:', error);
  }

  // Si no hay respuesta de Gemini
  return NextResponse.json([
    { ticker: 'NVDA', name: 'NVIDIA Corp.', catalyst: 'Demanda AI', target: '+15.2% Suba Proyectada', status: 'Alta Convicción', thesis: 'Fuerte volumen en datacenters.' },
    { ticker: 'YPFD', name: 'YPF S.A.', catalyst: 'Vaca Muerta Sur', target: '+28.0% Suba Proyectada', status: 'Value Play', thesis: 'Crecimiento de exportación en dólares.' },
    { ticker: 'GGAL', name: 'Grupo Fin. Galicia', catalyst: 'Crédito Privado', target: '+20.5% Suba Proyectada', status: 'Riesgo Alto', thesis: 'Recuperación del sector bancario local.' }
  ]);
}