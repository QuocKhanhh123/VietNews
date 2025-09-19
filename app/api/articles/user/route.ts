import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // For now, if no authorId provided, get articles by the most active author
    // In a real app, you'd get this from the session/JWT token for the logged-in user
    let targetAuthorId;
    if (authorId) {
      try {
        targetAuthorId = new ObjectId(authorId);
      } catch (error) {
        return NextResponse.json({ 
          success: false,
          error: 'ID tác giả không hợp lệ' 
        }, { status: 400 });
      }
    } else {
      // Find the author who has the most articles (likely the main user)
      const authorStats = await db.collection('articles').aggregate([
        { $group: { _id: '$authorId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]).toArray();

      if (authorStats.length === 0) {
        return NextResponse.json({ 
          success: false,
          error: 'Không tìm thấy bài viết nào' 
        }, { status: 404 });
      }

      targetAuthorId = authorStats[0]._id;
      
      // Get author info for debugging
      const authorInfo = await db.collection('users').findOne({ _id: targetAuthorId });
    }

    // Build aggregation pipeline
    const matchStage: any = { authorId: targetAuthorId };
    
    // Add status filter
    if (status && status !== 'all') {
      matchStage.status = status;
    }

    // Add search filter
    if (search) {
      matchStage.$or = [
        { title: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } }
      ];
    }

    const pipeline: any[] = [
      { $match: matchStage },
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
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          categoryName: { $ifNull: ['$category.name', 'Chưa phân loại'] },
          categorySlug: { $ifNull: ['$category.slug', 'uncategorized'] },
          authorName: { $ifNull: ['$author.fullname', 'Không rõ'] }
        }
      }
    ];

    // Add category filter after lookup
    if (category && category !== 'all') {
      pipeline.push({ $match: { categoryName: category } });
    }

    // Sort by most recent first
    pipeline.push({ $sort: { updatedAt: -1 } });

    // Project final fields
    pipeline.push({
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
        categoryName: 1,
        categorySlug: 1,
        authorName: 1,
        authorId: 1,
        categoryId: 1
      }
    });

    const articles = await db.collection('articles').aggregate(pipeline).toArray();

    return NextResponse.json({ 
      success: true,
      data: articles,
      totalCount: articles.length
    });
  } catch (error) {
    console.error('User Articles API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Lỗi server' 
    }, { status: 500 });
  }
}