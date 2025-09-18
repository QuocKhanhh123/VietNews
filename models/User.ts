import {ObjectId} from "mongodb";

export interface User { 
    _id?: ObjectId;
    fullname: string;
    email: string;
    passwordHash: string; 
    role: 'guest' | 'user';
    createdAt?: Date;
}