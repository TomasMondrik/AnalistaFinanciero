import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function GET() {
  // Lista de activos para que Gemini analice y elija las 3 mejores oportunidades actuales
  const marketUniverse = [
    { ticker: 'PAMP', name: 'Pampa Energía', type: 'Acción AR' },
    { ticker: 'GOOGL', name: 'Alphabet Inc.', type: 'CEDEAR' },
    { ticker: 'AL30', name: 'Bono Soberano ARS', type: 'Renta Fija' },
    { ticker: 'YPFD', name: 'YPF S.A.', type: 'Acción AR' },
    { ticker: 'NVDA', name: 'NVIDIA Corp.', type: 'CEDEAR' },
    { ticker: 'MELI', name: 'MercadoLibre', type: 'CEDEAR' }
  ];

  try {
    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un analista cuantitativo Senior enfocado en el mercado argentino (Merval, CEDEARs y Bonos).
        Analizá el universo de activos disponible y elegí LAS 3 MEJORES OPORTUNIDADES de inversión actuales según catalizadores macro y microeconómicos.

        Devolvé ÚNICAMENTE un JSON válido con esta estructura exacta de arreglo:
        [
          {
            "ticker": "TICKER",
            "name": "Nombre de la Empresa o Bono",
            "catalyst": "Catalizador clave corto (ej: Balance Q2 + Exportaciones)",
            "target": "+XX.X% Suba Proyectada",
            "status": "Alta Convicción / Value Play / Riesgo Alto",
            "thesis": "Explicación de 2 oraciones sobre la tesis de inversión y por qué tiene potencial."
          }
        ]

        Universo a evaluar:
        ${JSON.stringify(marketUniverse)}
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
    console.error('Error generando oportunidades con Gemini:', error);
  }

  // Fallback estático en caso de que falle la conexión
  return NextResponse.json([
    {
      ticker: 'PAMP',
      name: 'Pampa Energía',
      catalyst: 'Balance + Tarifas',
      target: '+22.4% Suba Proyectada',
      status: 'Alta Convicción',
      thesis: 'Fuerte generación de caja en dólares por exportación de gas y capacidad de transporte habilitada.'
    },
    {
      ticker: 'GOOGL',
      name: 'Alphabet Inc.',
      catalyst: 'Sobreventa / Ratio Atractivo',
      target: '+18.1% Suba Proyectada',
      status: 'Value Play',
      thesis: 'Valuación castigada injustamente respecto a sus pares de Big Tech manteniendo márgenes del 30%.'
    },
    {
      ticker: 'AL30',
      name: 'Bono Soberano ARS',
      catalyst: 'Acumulación de reservas BCRA',
      target: '+31.0% Suba Proyectada',
      status: 'Riesgo Alto',
      thesis: 'Paridad atractiva con flujo de cupones garantizado en el mediano plazo si se consolida el superávit.'
    }
  ]);
}