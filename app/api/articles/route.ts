import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Articles } from '@/models/Articles';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();

    const articles = await db.collection<Articles>('articles').find().toArray();

    return NextResponse.json({ data: articles });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 }, );
  }
}
