import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID bài viết không hợp lệ' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Find article by ID
    const article = await db.collection('articles').findOne({
      _id: new ObjectId(id),
      status: 'published'
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Bài viết không tồn tại' },
        { status: 404 }
      );
    }

    // Increment view count
    await db.collection('articles').updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    // Transform data for frontend
    const transformedArticle = {
      id: article._id.toString(),
      title: article.title,
      slug: article.slug,
      content: article.content,
      excerpt: article.shortDescription || '',
      imageUrl: article.coverImageUrl || '/placeholder.jpg',
      category: 'Tin tức', // Có thể join với categories sau
      author: 'Admin', // Có thể join với users sau
      publishedAt: article.publicationDate,
      updatedAt: article.updatedAt,
      views: (article.views || 0) + 1, // +1 vì vừa tăng view
      tags: article.tags || []
    };

    return NextResponse.json(transformedArticle, { status: 200 });

  } catch (error) {
    console.error('Get article detail error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}