import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'ID bài viết không hợp lệ' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Build query based on admin access
    const query: any = { _id: new ObjectId(id) };
    if (!isAdmin) {
      query.status = 'published';
    }

    // Use aggregation to get full article info with category and author
    const pipeline = [
      { $match: query },
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

    const articles = await db.collection('articles').aggregate(pipeline).toArray();

    if (articles.length === 0) {
      return NextResponse.json(
        { error: 'Bài viết không tồn tại' },
        { status: 404 }
      );
    }

    const article = articles[0];

    // Increment view count only for public access
    if (!isAdmin) {
      await db.collection('articles').updateOne(
        { _id: new ObjectId(id) },
        { $inc: { views: 1 } }
      );
    }

    // Return full article data for admin, transformed data for public
    if (isAdmin) {
      return NextResponse.json({ 
        success: true,
        data: article
      });
    } else {
      // Transform data for frontend
      const transformedArticle = {
        id: article._id.toString(),
        title: article.title,
        slug: article.slug,
        content: article.content,
        excerpt: article.shortDescription || '',
        imageUrl: article.coverImageUrl || '/placeholder.jpg',
        category: article.categoryName,
        author: article.authorName,
        publishedAt: article.publicationDate,
        updatedAt: article.updatedAt,
        views: (article.views || 0) + 1, // +1 vì vừa tăng view
        tags: article.tags || []
      };

      return NextResponse.json(transformedArticle, { status: 200 });
    }

  } catch (error) {
    console.error('Get article detail error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}

// PUT - Cập nhật bài viết
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const { id } = params;
    const body = await request.json();
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false,
        error: 'ID bài viết không hợp lệ' 
      }, { status: 400 });
    }

    const { 
      title, 
      slug, 
      shortDescription, 
      content, 
      coverImageUrl, 
      categoryId, 
      tags, 
      status,
      authorId // Để kiểm tra quyền sở hữu
    } = body;

    // Kiểm tra các trường bắt buộc
    if (!title || !content || !categoryId || !authorId) {
      return NextResponse.json({ 
        success: false,
        error: 'Thiếu thông tin bắt buộc' 
      }, { status: 400 });
    }

    // Kiểm tra bài viết có tồn tại và thuộc về user hiện tại không
    const existingArticle = await db.collection('articles').findOne({
      _id: new ObjectId(id)
    });

    if (!existingArticle) {
      return NextResponse.json({ 
        success: false,
        error: 'Không tìm thấy bài viết' 
      }, { status: 404 });
    }

    // Kiểm tra quyền sở hữu
    if (existingArticle.authorId.toString() !== authorId) {
      return NextResponse.json({ 
        success: false,
        error: 'Bạn không có quyền chỉnh sửa bài viết này' 
      }, { status: 403 });
    }

    // Kiểm tra categoryId có hợp lệ không
    if (!ObjectId.isValid(categoryId)) {
      return NextResponse.json({ 
        success: false,
        error: 'ID danh mục không hợp lệ' 
      }, { status: 400 });
    }

    const categoryExists = await db.collection('categories').findOne({
      _id: new ObjectId(categoryId)
    });

    if (!categoryExists) {
      return NextResponse.json({ 
        success: false,
        error: 'Danh mục không tồn tại' 
      }, { status: 400 });
    }

    // Cập nhật bài viết
    const updateData = {
      title,
      slug: slug || title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .trim(),
      shortDescription,
      content,
      coverImageUrl: coverImageUrl || '',
      categoryId: new ObjectId(categoryId),
      tags: Array.isArray(tags) ? tags : [],
      status: status || 'draft',
      updatedAt: new Date()
    };

    const result = await db.collection('articles').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Không thể cập nhật bài viết' 
      }, { status: 400 });
    }

    // Lấy bài viết đã cập nhật
    const updatedArticle = await db.collection('articles').findOne({
      _id: new ObjectId(id)
    });

    return NextResponse.json({ 
      success: true,
      data: updatedArticle,
      message: 'Cập nhật bài viết thành công'
    });
  } catch (error) {
    console.error('Update Article API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Lỗi server' 
    }, { status: 500 });
  }
}

// DELETE - Xóa bài viết
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const authorId = searchParams.get('authorId');
    
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ 
        success: false,
        error: 'ID bài viết không hợp lệ' 
      }, { status: 400 });
    }

    if (!authorId) {
      return NextResponse.json({ 
        success: false,
        error: 'Thiếu thông tin tác giả' 
      }, { status: 400 });
    }

    // Kiểm tra bài viết có tồn tại và thuộc về user hiện tại không
    const existingArticle = await db.collection('articles').findOne({
      _id: new ObjectId(id)
    });

    if (!existingArticle) {
      return NextResponse.json({ 
        success: false,
        error: 'Không tìm thấy bài viết' 
      }, { status: 404 });
    }

    // Kiểm tra quyền sở hữu
    if (existingArticle.authorId.toString() !== authorId) {
      return NextResponse.json({ 
        success: false,
        error: 'Bạn không có quyền xóa bài viết này' 
      }, { status: 403 });
    }

    // Xóa bài viết
    const result = await db.collection('articles').deleteOne({
      _id: new ObjectId(id)
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'Không thể xóa bài viết' 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      message: 'Xóa bài viết thành công'
    });
  } catch (error) {
    console.error('Delete Article API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Lỗi server' 
    }, { status: 500 });
  }
}