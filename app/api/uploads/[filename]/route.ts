import { NextRequest, NextResponse } from 'next/server';
import { stat } from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
    
    // Check if file exists
    await stat(filePath);
    
    // If file exists, redirect to the static file
    return NextResponse.redirect(new URL(`/uploads/${filename}`, request.url));
    
  } catch (error) {
    // File doesn't exist, return placeholder
    return NextResponse.redirect(new URL('/placeholder.jpg', request.url));
  }
}