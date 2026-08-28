import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un analista cuantitativo Senior.
        Analizá el mercado financiero actual (Merval, CEDEARs de Wall Street y Bonos Argentinos).
        Elegí 3 activos DISTINTOS y atractivos para el día de hoy (ej: GGAL, YPFD, PAMP, BMA, NVDA, AAPL, AL30, GD30, MELI, TSLA).

        Devolvé ÚNICAMENTE un JSON válido con este formato:
        [
          {
            "ticker": "TICKER",
            "name": "Nombre completo del activo",
            "catalyst": "Catalizador del día",
            "target": "+XX.X% Suba Proyectada",
            "status": "Alta Convicción / Value Play / Riesgo Alto",
            "thesis": "Explicación táctica de 2 oraciones."
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const rawText = response.text || '[]';
      const opportunities = JSON.parse(rawText);

      if (Array.isArray(opportunities) && opportunities.length > 0) {
        return NextResponse.json(opportunities);
      }
    }
  } catch (error) {
    console.error('Error generando oportunidades:', error);
  }

  return NextResponse.json([
    { ticker: 'YPFD', name: 'YPF S.A.', catalyst: 'Vaca Muerta & Exportaciones', target: '+18.5% Suba Proyectada', status: 'Alta Convicción', thesis: 'Aumento continuo en la capacidad de transporte de crudo y sólidos márgenes de refino.' },
    { ticker: 'GGAL', name: 'Grupo Fin. Galicia', catalyst: 'Expansión de Crédito', target: '+22.0% Suba Proyectada', status: 'Value Play', thesis: 'Crecimiento de depósitos y recuperación de márgenes en moneda local.' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', catalyst: 'Demanda de Infraestructura AI', target: '+14.2% Suba Proyectada', status: 'Alta Convicción', thesis: 'Adopción acelerada de chips Blackwell por proveedores de nube.' }
  ]);
}