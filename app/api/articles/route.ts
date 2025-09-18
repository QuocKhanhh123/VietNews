import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Articles } from '@/models/Articles';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Sử dụng aggregation để join với categories
    const articles = await db.collection('articles').aggregate([
      { $match: { status: 'published' } },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          categoryName: { $ifNull: ['$category.name', 'Chưa phân loại'] },
          categorySlug: { $ifNull: ['$category.slug', 'uncategorized'] }
        }
      },
      { $sort: { publicationDate: -1 } },
      {
        $project: {
          _id: 1,
          title: 1,
          slug: 1,
          shortDescription: 1,
          content: 1,
          coverImageUrl: 1,
          publicationDate: 1,
          updatedAt: 1,
          status: 1,
          views: 1,
          tags: 1,
          categoryId: 1,
          categoryName: 1,
          categorySlug: 1
        }
      }
    ]).toArray();

    console.log('Articles with categories found:', articles.length);

    return NextResponse.json({ 
      success: true,
      data: articles 
    });
  } catch (error) {
    console.error('Articles API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Server error' 
    }, { status: 500 });
  }
}
