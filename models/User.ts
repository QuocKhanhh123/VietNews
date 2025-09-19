import {ObjectId} from "mongodb";

export interface User { 
    _id?: ObjectId;
    fullName: string; // Đổi thành fullName để khớp với database
    email: string;
    passwordHash: string; 
    role: 'guest' | 'user' | 'admin'; // Thêm role admin
    createdAt?: Date;
}