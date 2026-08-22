import { NextResponse } from 'next/server';

let portfolioState = [
  { id: '1', ticker: 'YPFD', type: 'Acción AR', amount: 40750, yield: 48.66, status: 'amber', action: 'Proteger Ganancia' },
  { id: '2', ticker: 'PAMP', type: 'Acción AR', amount: 40440, yield: 4.90, status: 'green', action: 'Mantener' },
  { id: '3', ticker: 'AAPL', type: 'CEDEAR', amount: 49360, yield: -2.28, status: 'green', action: 'Mantener' },
  { id: '4', ticker: 'SPY', type: 'ETF CEDEAR', amount: 40720, yield: 0.01, status: 'green', action: 'Mantener' },
  { id: '5', ticker: 'GOOGL', type: 'CEDEAR', amount: 28470, yield: -2.41, status: 'amber', action: 'Monitorear' },
  { id: '6', ticker: 'AMZN', type: 'CEDEAR', amount: 22960, yield: 4.79, status: 'green', action: 'Mantener' },
  { id: '7', ticker: 'NVDA', type: 'CEDEAR', amount: 14280, yield: 2.30, status: 'green', action: 'Mantener' },
  { id: '8', ticker: 'RGTI', type: 'CEDEAR Quantum', amount: 14280, yield: 8.41, status: 'red', action: 'Vender / Reducir' },
  { id: '9', ticker: 'TXAR', type: 'Acción AR', amount: 2091, yield: 2.53, status: 'amber', action: 'Neutral' }
];

export async function GET() {
  return NextResponse.json(portfolioState);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { ticker, amount, type } = body;
  const existingIndex = portfolioState.findIndex(p => p.ticker.toUpperCase() === ticker.toUpperCase());
  
  if (existingIndex > -1) {
    portfolioState[existingIndex].amount = Number(amount);
    portfolioState[existingIndex].type = type;
  } else {
    portfolioState.push({
      id: Date.now().toString(),
      ticker: ticker.toUpperCase(),
      type,
      amount: Number(amount),
      yield: 0.00,
      status: 'green',
      action: 'Mantener'
    });
  }

  return NextResponse.json({ success: true, portfolio: portfolioState });
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get('ticker');
  portfolioState = portfolioState.filter(p => p.ticker.toUpperCase() !== ticker?.toUpperCase());
  return NextResponse.json({ success: true, portfolio: portfolioState });
}