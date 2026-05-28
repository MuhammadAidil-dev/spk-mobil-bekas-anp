import { Document, Types } from 'mongoose';

export interface IAdmin {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password_hash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IAdminDocument = IAdmin & Document;
