import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const categories = await db.collection('categories')
      .find({})
      .sort({ name: 1 })
      .toArray();

    console.log('Categories found:', categories.length);

    // Transform data cho frontend
    const transformedCategories = categories.map(category => ({
      id: category._id.toString(),
      name: category.name,
      slug: category.slug
    }));

    return NextResponse.json({
      success: true,
      data: transformedCategories
    }, { status: 200 });

  } catch (error) {
    console.error('Categories API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra khi tải danh mục'
    }, { status: 500 });
  }
}