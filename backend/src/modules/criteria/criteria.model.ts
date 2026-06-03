import { model, Schema } from 'mongoose';
import { ICriteriaDocument } from './criteria.type';

const CriteriaSchema = new Schema<ICriteriaDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      min: [3, 'Name minimal 3 karakter'],
    },
    type: {
      type: String,
      enum: ['cost', 'benefit'],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    order: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

CriteriaSchema.index({ code: 1 }, { unique: true });
CriteriaSchema.index({ order: 1 });

export const Criteria = model<ICriteriaDocument>('Criteria', CriteriaSchema);
