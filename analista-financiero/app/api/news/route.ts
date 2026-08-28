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
        Sos un terminal financiero en vivo para Merval y Wall Street.
        Generá 4 noticias breves e impactantes sobre el mercado actual (Dólar CCL, Merval, YPF, Pampa Energía, Galicia, NVIDIA, Apple, Mercado Libre).

        Devolvé ÚNICAMENTE un JSON válido con esta estructura (2 noticias MINE y 2 noticias EXPLORE):
        [
          {
            "id": "1",
            "source": "El Cronista • Argentina",
            "time": "${timeString}",
            "elapsed": "en vivo",
            "title": "YPF acelera la producción de crudo en Vaca Muerta para exportación",
            "impactTitle": "Impacto directo en YPFD / PAMP:",
            "impactDescription": "Incremento de divisas operativas y consolidación de flujo libre de caja.",
            "type": "MINE",
            "ticker": "YPFD"
          },
          {
            "id": "2",
            "source": "Bloomberg • Wall Street",
            "time": "${timeString}",
            "elapsed": "en vivo",
            "title": "NVIDIA sostiene sólida demanda en infraestructura para Inteligencia Artificial",
            "impactTitle": "Impacto directo en NVDA:",
            "impactDescription": "Liderazgo tecnológico que fortalece la proyección de ingresos trimestrales.",
            "type": "MINE",
            "ticker": "NVDA"
          },
          {
            "id": "3",
            "source": "Ámbito Financiero • Dólar & Macro",
            "time": "${timeString}",
            "elapsed": "en vivo",
            "title": "El Dólar CCL cotiza con estabilidad por intervención y volumen del BCRA",
            "impactTitle": "Impacto Clave Macro & CEDEARs:",
            "impactDescription": "La brecha cambiaria acotada estabiliza la cotización en pesos de CEDEARs.",
            "type": "EXPLORE",
            "ticker": "CCL"
          },
          {
            "id": "4",
            "source": "Rava Bursátil • Merval",
            "time": "${timeString}",
            "elapsed": "en vivo",
            "title": "El índice S&P Merval testea resistencias impulsado por el sector bancario",
            "impactTitle": "Análisis Renta Variable ARS:",
            "impactDescription": "Mayor preferencia por activos locales ante la recuperación del crédito privado.",
            "type": "EXPLORE",
            "ticker": "GGAL"
          }
        ]
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const rawText = response.text || '[]';
      const newsData = JSON.parse(rawText);

      if (Array.isArray(newsData) && newsData.length > 0) {
        return NextResponse.json(newsData);
      }
    }
  } catch (error) {
    console.error('Error procesando noticias:', error);
  }

  // Fallback si falla la API
  return NextResponse.json([
    {
      id: '1',
      source: 'El Cronista • Argentina',
      time: timeString,
      elapsed: 'en vivo',
      title: 'YPF acelera la producción de crudo en Vaca Muerta para exportación',
      impactTitle: 'Impacto directo en YPFD / PAMP:',
      impactDescription: 'Incremento de divisas operativas y consolidación de flujo libre de caja.',
      type: 'MINE',
      ticker: 'YPFD'
    },
    {
      id: '2',
      source: 'Bloomberg • Wall Street',
      time: timeString,
      elapsed: 'en vivo',
      title: 'NVIDIA sostiene sólida demanda en infraestructura para Inteligencia Artificial',
      impactTitle: 'Impacto directo en NVDA:',
      impactDescription: 'Liderazgo tecnológico que fortalece la proyección de ingresos trimestrales.',
      type: 'MINE',
      ticker: 'NVDA'
    },
    {
      id: '3',
      source: 'Ámbito Financiero • Dólar & Macro',
      time: timeString,
      elapsed: 'en vivo',
      title: 'El Dólar CCL cotiza con estabilidad por intervención y volumen del BCRA',
      impactTitle: 'Impacto Clave Macro & CEDEARs:',
      impactDescription: 'La brecha cambiaria acotada estabiliza la cotización en pesos de CEDEARs.',
      type: 'EXPLORE',
      ticker: 'CCL'
    },
    {
      id: '4',
      source: 'Rava Bursátil • Merval',
      time: timeString,
      elapsed: 'en vivo',
      title: 'El índice S&P Merval testea resistencias impulsado por el sector bancario',
      impactTitle: 'Análisis Renta Variable ARS:',
      impactDescription: 'Mayor preferencia por activos locales ante la recuperación del crédito privado.',
      type: 'EXPLORE',
      ticker: 'GGAL'
    }
  ]);
}