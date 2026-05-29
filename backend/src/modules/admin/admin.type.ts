import { boolean } from 'joi';
import { Document, Types } from 'mongoose';

export interface IAdmin {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password_hash: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IAdminDocument = IAdmin &
  Document & {
    comparePassword: (password: string) => Promise<boolean>;
  };
export type IAdminResponse = Omit<IAdmin, 'password_hash'>;
