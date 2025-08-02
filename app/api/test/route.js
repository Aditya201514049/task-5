// app/api/test/route.js (App Router)
import { NextResponse } from 'next/server';
import { generateBooks } from '@/lib/generateBooks';

export async function GET() {
  const data = generateBooks({
    seed: 123,
    locale: 'fr-FR',
    page: 1,
    count: 20,
  });

  return NextResponse.json(data);
}
