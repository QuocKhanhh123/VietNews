import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false,
        error: 'Không tìm thấy file' 
      }, { status: 400 });
    }

    // Validate file type
    if (!file.type || !file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false,
        error: 'File phải là định dạng ảnh' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ 
        success: false,
        error: 'Kích thước file không được vượt quá 5MB' 
      }, { status: 400 });
    }

    // For Vercel deployment, we can't write to file system
    // This is a temporary solution - in production you should use cloud storage
    if (process.env.VERCEL) {
      return NextResponse.json({ 
        success: false,
        error: 'Upload ảnh chưa được hỗ trợ trên Vercel. Vui lòng sử dụng URL ảnh trực tiếp.' 
      }, { status: 501 });
    }

    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}${fileExtension}`;
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Save file
    const filePath = path.join(uploadsDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    await writeFile(filePath, buffer);

    // Return the public URL
    const imageUrl = `/uploads/${fileName}`;

    return NextResponse.json({ 
      success: true,
      imageUrl: imageUrl,
      message: 'Upload ảnh thành công'
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Có lỗi xảy ra khi upload ảnh' 
    }, { status: 500 });
  }
}