import { NextResponse } from 'next/server';
import Parser from 'rss-parser';

const parser = new Parser();

// Fuentes RSS financieras de Argentina y EE.UU.
const FEEDS = [
  { name: 'El Cronista', url: 'https://www.cronista.com/files/rss/news.xml', region: 'AR' },
  { name: 'Ámbito', url: 'https://www.ambito.com/rss/home.xml', region: 'AR' }
];

export async function GET() {
  try {
    const allArticles: any[] = [];

    for (const feed of FEEDS) {
      try {
        const parsed = await parser.parseURL(feed.url);
        parsed.items.slice(0, 5).forEach((item) => {
          allArticles.push({
            id: item.guid || item.link || Math.random().toString(),
            source: `${feed.name} • ${feed.region}`,
            time: item.pubDate ? new Date(item.pubDate).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }) : 'Reciente',
            elapsed: 'En vivo',
            title: item.title || '',
            impactTitle: 'Impacto Automático:',
            impactDescription: item.contentSnippet ? item.contentSnippet.slice(0, 120) + '...' : 'Análisis macro / sectorial en seguimiento.',
            type: feed.region === 'AR' ? 'MINE' : 'EXPLORE',
            weight: 8,
            isCritical: item.title?.toLowerCase().includes('ypf') || item.title?.toLowerCase().includes('fed')
          });
        });
      } catch (err) {
        console.error(`Error leyendo feed ${feed.name}:`, err);
      }
    }

    return NextResponse.json(allArticles);
  } catch (error) {
    return NextResponse.json({ error: 'Error procesando noticias' }, { status: 500 });
  }
}