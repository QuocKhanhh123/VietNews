import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Articles } from '@/models/Articles';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // First, let's check if we have both articles and users
    const articlesCount = await db.collection('articles').countDocuments({ status: 'published' });
    const usersCount = await db.collection('users').countDocuments();

    // Sử dụng aggregation để join với categories và users
    const articles = await db.collection('articles').aggregate([
      { $match: { status: 'published' } },
      // Lookup users directly without converting ObjectId (MongoDB handles this automatically)
      {
        $lookup: {
          from: 'users',
          localField: 'authorId',
          foreignField: '_id',
          as: 'author'
        }
      },
      { $unwind: { path: '$author', preserveNullAndEmptyArrays: true } },
      // Lookup categories
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
          // Sử dụng fullName từ user model (chú ý fullName không phải fullname)
          authorName: { 
            $cond: {
              if: { $ne: ['$author', null] },
              then: { $ifNull: ['$author.fullName', { $ifNull: ['$author.fullname', 'Không rõ'] }] },
              else: 'Không rõ'
            }
          }
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
          categorySlug: 1,
          authorId: 1,
          authorName: 1,
          // Include debug fields temporarily
          'author._id': 1,
          'author.fullName': 1,
          'author.fullname': 1,
          'author.email': 1
        }
      }
    ]).toArray();

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

export async function POST(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    const body = await request.json();
    const { title, shortDescription, content, category, tags, status, coverImageUrl, authorId } = body;

    // Validation
    if (!title || !shortDescription || !content || !category) {
      return NextResponse.json({ 
        success: false,
        error: 'Thiếu thông tin bắt buộc' 
      }, { status: 400 });
    }

    // Validate authorId if provided
    let finalAuthorId;
    if (authorId) {
      try {
        // Verify that the authorId exists in the database
        const authorObjectId = new ObjectId(authorId);
        const authorUser = await db.collection('users').findOne({ _id: authorObjectId });
        if (!authorUser) {
          return NextResponse.json({ 
            success: false,
            error: 'Tác giả không tồn tại' 
          }, { status: 400 });
        }
        finalAuthorId = authorObjectId;
      } catch (error) {
        return NextResponse.json({ 
          success: false,
          error: 'ID tác giả không hợp lệ' 
        }, { status: 400 });
      }
    } else {
      // Fallback to finding a user if no authorId provided
      let authorUser = await db.collection('users').findOne({ role: 'admin' });
      
      if (!authorUser) {
        authorUser = await db.collection('users').findOne({});
      }
      
      if (!authorUser) {
        return NextResponse.json({ 
          success: false,
          error: 'Không tìm thấy tác giả. Vui lòng tạo ít nhất một user trong hệ thống.' 
        }, { status: 400 });
      }
      
      finalAuthorId = authorUser._id;
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim('-'); // Remove hyphens from start and end

    // Check if slug already exists
    const existingSlug = await db.collection('articles').findOne({ slug });
    const finalSlug = existingSlug ? `${slug}-${Date.now()}` : slug;

    // Find category by name to get categoryId
    const categoryDoc = await db.collection('categories').findOne({ name: category });
    if (!categoryDoc) {
      return NextResponse.json({ 
        success: false,
        error: 'Danh mục không tồn tại' 
      }, { status: 400 });
    }

    const now = new Date();
    const articleData: Omit<Articles, '_id'> = {
      title,
      slug: finalSlug,
      shortDescription,
      content,
      coverImageUrl: coverImageUrl || '/placeholder.jpg',
      publicationDate: status === 'published' ? now : new Date(0), // Set to epoch if draft
      updatedAt: now,
      status: status as 'published' | 'draft',
      views: 0,
      tags: Array.isArray(tags) ? tags : [],
      authorId: finalAuthorId, // Use the validated authorId
      categoryId: categoryDoc._id
    };

    const result = await db.collection('articles').insertOne(articleData);

    if (result.acknowledged) {
      return NextResponse.json({ 
        success: true,
        data: { 
          _id: result.insertedId,
          ...articleData 
        },
        message: 'Bài viết đã được tạo thành công'
      });
    } else {
      return NextResponse.json({ 
        success: false,
        error: 'Không thể tạo bài viết' 
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Create Article API Error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Lỗi server' 
    }, { status: 500 });
  }
}
