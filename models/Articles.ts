import {ObjectId} from "mongodb";

export interface Articles {
  _id: ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl: string;
  publicationDate: Date;
  updatedAt: Date;
  status: 'published' | 'draft';
  views: number;
  tags: string[];
  authorId: ObjectId;
  categoryId: ObjectId;
}