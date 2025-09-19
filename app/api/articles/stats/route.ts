import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');

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
    }

    // Get today's date range
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Run aggregation queries in parallel
    const [
      totalArticlesResult,
      publishedTodayResult,
      totalViewsResult,
      statusBreakdownResult
    ] = await Promise.all([
      // Total articles by author
      db.collection('articles').countDocuments({ authorId: targetAuthorId }),
      
      // Articles published today by author
      db.collection('articles').countDocuments({ 
        authorId: targetAuthorId,
        status: 'published',
        publicationDate: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }),
      
      // Total views for author's articles
      db.collection('articles').aggregate([
        { $match: { authorId: targetAuthorId } },
        { $group: { _id: null, totalViews: { $sum: '$views' } } }
      ]).toArray(),
      
      // Status breakdown
      db.collection('articles').aggregate([
        { $match: { authorId: targetAuthorId } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]).toArray()
    ]);

    const totalViews = totalViewsResult.length > 0 ? totalViewsResult[0].totalViews : 0;
    
    const statusBreakdown = statusBreakdownResult.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const stats = {
      totalArticles: totalArticlesResult,
      publishedArticles: statusBreakdown['published'] || 0,
      draftArticles: statusBreakdown['draft'] || 0,
      publishedToday: publishedTodayResult,
      totalViews: totalViews,
      statusBreakdown: statusBreakdown
    };


    return NextResponse.json({ 
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Stats API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Lỗi server' 
    }, { status: 500 });
  }
}