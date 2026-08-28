import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export const dynamic = 'force-dynamic';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un analista cuantitativo Senior en Argentina.
        Analizá el mercado financiero actual (Merval, CEDEARs y Bonos).
        Elegí 3 activos atractivos y variados para el día de hoy (ej: GGAL, YPFD, PAMP, BMA, NVDA, AAPL, AL30, GD30, MELI).
        
        Devolvé ÚNICAMENTE un JSON estricto con esta estructura:
        [
          {
            "ticker": "TICKER",
            "name": "Nombre de la empresa/activo",
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

      const opportunities = JSON.parse(response.text || '[]');
      return NextResponse.json(opportunities);
    }
  } catch (error) {
    console.error('Error con Gemini en Opportunities:', error);
  }

  return NextResponse.json([
    { ticker: 'YPFD', name: 'YPF S.A.', catalyst: 'Vaca Muerta & Exportaciones', target: '+18.5% Suba Proyectada', status: 'Alta Convicción', thesis: 'Aumento continuo en la capacidad de transporte de crudo y sólidos márgenes de refino.' },
    { ticker: 'GGAL', name: 'Grupo Fin. Galicia', catalyst: 'Expansión de Crédito', target: '+22.0% Suba Proyectada', status: 'Value Play', thesis: 'Crecimiento de depósitos y recuperación de márgenes en moneda local.' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', catalyst: 'Demanda de Infraestructura AI', target: '+14.2% Suba Proyectada', status: 'Alta Convicción', thesis: 'Adopción acelerada de chips Blackwell por proveedores de nube.' }
  ]);
}