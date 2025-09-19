import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'relevance';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // Require either search query or category filter
    if (!query.trim() && !category.trim()) {
      return NextResponse.json({
        success: false,
        error: 'Vui lòng nhập từ khóa tìm kiếm hoặc chọn danh mục'
      }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Xây dựng query tìm kiếm
    const searchFilter: any = {
      status: 'published'
    };

    // Add text search conditions if query exists
    if (query.trim()) {
      searchFilter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { shortDescription: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ];
    }

    // Lọc theo category nếu có
    if (category && category !== 'all' && category !== 'Tất cả') {
      try {
        // Tìm category theo slug hoặc name
        const categoryDoc = await db.collection('categories').findOne({
          $or: [
            { slug: category },
            { name: category }
          ]
        });
        
        if (categoryDoc) {
          searchFilter.categoryId = categoryDoc._id;
        }
      } catch (error) {
        console.error('Category filter error:', error);
      }
    }

    // Pipeline aggregation
    const pipeline: any[] = [
      { $match: searchFilter },
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
          categorySlug: { $ifNull: ['$category.slug', 'uncategorized'] },
          // Tính điểm relevance đơn giản
          relevanceScore: query.trim() ? {
            $add: [
              { $cond: [{ $regexMatch: { input: '$title', regex: query, options: 'i' } }, 10, 0] },
              { $cond: [{ $regexMatch: { input: '$shortDescription', regex: query, options: 'i' } }, 5, 0] },
              { $cond: [{ $regexMatch: { input: '$content', regex: query, options: 'i' } }, 2, 0] }
            ]
          } : 1
        }
      }
    ];

    // Sắp xếp
    let sortStage: any = {};
    switch (sortBy) {
      case 'newest':
        sortStage = { publicationDate: -1 };
        break;
      case 'oldest':
        sortStage = { publicationDate: 1 };
        break;
      case 'most-viewed':
        sortStage = { views: -1 };
        break;
      case 'relevance':
      default:
        sortStage = { relevanceScore: -1, publicationDate: -1 };
        break;
    }
    pipeline.push({ $sort: sortStage });

    // Facet để có cả kết quả và tổng số
    pipeline.push({
      $facet: {
        articles: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $project: {
              _id: 1,
              title: 1,
              slug: 1,
              shortDescription: 1,
              coverImageUrl: 1,
              publicationDate: 1,
              views: 1,
              tags: 1,
              categoryName: 1,
              categorySlug: 1,
              relevanceScore: 1
            }
          }
        ],
        totalCount: [{ $count: 'count' }]
      }
    });

    const result = await db.collection('articles').aggregate(pipeline).toArray();
    const articles = result[0]?.articles || [];
    const total = result[0]?.totalCount[0]?.count || 0;

    // Transform data cho frontend
    const transformedArticles = articles.map((article: any) => ({
      id: article._id.toString(),
      title: article.title,
      excerpt: article.shortDescription || '',
      imageUrl: article.coverImageUrl || '/placeholder.jpg',
      category: article.categoryName,
      categorySlug: article.categorySlug,
      author: 'Admin',
      publishedAt: formatTimeAgo(article.publicationDate),
      publishedDate: article.publicationDate,
      slug: article.slug || article.title?.toLowerCase().replace(/\s+/g, '-'),
      views: article.views || 0,
      tags: article.tags || [],
      relevance: article.relevanceScore || 0
    }));

    // Tính toán thông tin phân trang
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      success: true,
      data: {
        articles: transformedArticles,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems: total,
          itemsPerPage: limit,
          hasNextPage,
          hasPrevPage
        },
        searchInfo: {
          query,
          category,
          sortBy,
          totalResults: total
        }
      }
    });

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json({
      success: false,
      error: 'Có lỗi xảy ra khi tìm kiếm'
    }, { status: 500 });
  }
}

// Helper function để format thời gian
function formatTimeAgo(date: any): string {
  if (!date) return 'Chưa rõ';
  const now = new Date();
  const publishDate = new Date(date);
  const diffInMs = now.getTime() - publishDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) {
    return 'Vừa xong';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} phút trước`;
  } else if (diffInHours < 24) {
    return `${diffInHours} giờ trước`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ngày trước`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} tuần trước`;
  } else {
    return publishDate.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}