# VietNews - Hệ thống Quản lý Tin tức

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?logo=next.js)](https://nextjs.org/)  
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)  
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)](https://www.mongodb.com/)  
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

## Giới thiệu
VietNews là hệ thống quản lý tin tức bằng **Next.js 15 + TypeScript**, tối ưu cho thị trường Việt Nam với phân quyền người dùng, CRUD bài viết, tìm kiếm & phân loại, responsive UI và tối ưu SEO.

## Tính năng
- Phân quyền: Guest (xem), User (tạo & quản lý bài viết)  
- CRUD bài viết với rich text editor  
- Phân loại & tìm kiếm tin tức  
- Thiết kế responsive, dark mode  
- SEO tối ưu (meta tags, sitemap, URL sạch)  
- Cập nhật real-time  

## Công nghệ
- **Frontend**: Next.js, TypeScript, Tailwind CSS, Shadcn/ui, Lucide Icons  
- **Backend**: Next.js API Routes, MongoDB, Node.js  
- **Deploy & Tools**: Vercel, MongoDB Atlas, Git  

## Cài đặt
```bash
# Clone repo
git clone https://github.com/NguyenLanNhi/VietNews.git
cd VietNews

# Cài dependencies
npm install

# Tạo file .env.local
MONGODB_URI=mongodb://localhost:27017/vietnews
JWT_SECRET=your-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Chạy dev server
npm run dev

Truy cập http://localhost:3000

 Deploy
# Build production
npm run build
npm start

# Deploy Vercel
npm i -g vercel
vercel --prod

 Cấu trúc thư mục
VietNews/
├── app/           # App Router & API routes
├── components/    # React components
├── context/       # React Context
├── lib/           # Utilities & DB connection
├── models/        # Mongoose models
├── public/        # Static assets
└── styles/        # Global styles

Nếu thấy hữu ích, hãy cho dự án một star ⭐!