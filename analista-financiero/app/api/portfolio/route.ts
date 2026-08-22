import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function GET() {
  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = await req.json();
  const { ticker, amount, type } = body;

  const { data: existing } = await supabase
    .from('portfolio')
    .select('*')
    .eq('ticker', ticker.toUpperCase())
    .single();

  if (existing) {
    await supabase
      .from('portfolio')
      .update({ amount: Number(amount), type })
      .eq('ticker', ticker.toUpperCase());
  } else {
    await supabase.from('portfolio').insert([
      {
        ticker: ticker.toUpperCase(),
        type,
        amount: Number(amount),
        yield: 0.0,
        status: 'green',
        action: 'Mantener'
      }
    ]);
  }

  const { data: updated } = await supabase.from('portfolio').select('*');
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get('ticker');

  if (ticker) {
    await supabase.from('portfolio').delete().eq('ticker', ticker.toUpperCase());
  }

  const { data: updated } = await supabase.from('portfolio').select('*');
  return NextResponse.json(updated);
}