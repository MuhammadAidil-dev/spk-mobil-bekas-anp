import mongoose, { Schema } from 'mongoose';
import { IAdminDocument } from './admin.type';
import bcrypt from 'bcryptjs';

const validEmail = /^\S+@\S+\.\S+$/;

const AdminSchema = new Schema<IAdminDocument>(
  {
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      trim: true,
      minLength: [3, 'Email minimal 3 karakter'],
      match: [validEmail, 'Format email tidak valid'],
    },
    password_hash: {
      type: String,
      required: [true, 'Password wajib diisi'],
      trim: true,
      minLength: [8, 'Password minimal 8 karakter'],
      select: false, // password tidak ikut ter-query secara default
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, 'Name minimal 3 karakter'],
    },
  },
  {
    timestamps: true,
  },
);

// hash password sebelum disimpan
AdminSchema.pre('save', async function (next) {
  if (!this.isModified('password_hash')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password_hash = await bcrypt.hash(this.password_hash, salt);
  next();
});

// Method untuk membandingkan password
AdminSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password_hash);
};

export const Admin = mongoose.model<IAdminDocument>('Admin', AdminSchema);
