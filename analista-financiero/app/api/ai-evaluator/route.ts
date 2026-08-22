import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function POST(req: Request) {
  try {
    const { portfolio } = await req.json();

    if (process.env.GEMINI_API_KEY) {
      const prompt = `
        Sos un gestor de riesgos cuantitativo. Analizá el siguiente portfolio de inversión y devolvé UNICAMENTE un JSON válido con esta estructura exacta:
        {
          "riskLevel": "Nivel de riesgo estimado (ej: Riesgo Moderado / Alerta de Concentración)",
          "suggestion": "Explicación de 1 o 2 oraciones recomendando acciones concretas según las posiciones de la cartera.",
          "statusColor": "red, amber o green"
        }

        Portfolio del cliente:
        ${JSON.stringify(portfolio)}
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const evaluation = JSON.parse(response.text || '{}');
      return NextResponse.json(evaluation);
    }
  } catch (error) {
    console.error('Error evaluando riesgo con Gemini:', error);
  }

  return NextResponse.json({
    riskLevel: 'Riesgo Moderado',
    suggestion: 'Diversificación adecuada entre acciones del Merval y CEDEARs tecnológicos.',
    statusColor: 'amber'
  });
}