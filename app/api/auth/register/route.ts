import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { User } from '@/models/User';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { fullname, email, password } = await request.json();

    // Validate input
    if (!fullname || !email || !password) {
      return NextResponse.json(
        { error: 'Vui lòng điền đầy đủ thông tin' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email đã được sử dụng' },
        { status: 400 }
      );
    }

    // Hash password using crypto
    const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

    // Create new user
    const newUser: Omit<User, '_id'> = {
      fullname,
      email,
      passwordHash,
      role: 'user', // Mặc định là user, có thể tạo bài viết
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);

    return NextResponse.json(
      { 
        message: 'Đăng ký thành công',
        userId: result.insertedId.toString()
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { error: 'Lỗi server' },
      { status: 500 }
    );
  }
}