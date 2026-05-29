import { Document, Types } from 'mongoose';

export type TCriteryaType = 'cost' | 'benefit';

export interface ICriteria {
  _id: Types.ObjectId;
  code: string;
  name: string;
  type: TCriteryaType;
  description: string;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export type ICriteriaDocument = ICriteria & Document;
