import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IPortfolioItem extends Document {
  user: IUser['_id'];
  title: string;
  description?: string;
  imageUrl?: string;
  projectLink?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PortfolioItemSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    projectLink: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

PortfolioItemSchema.index({ user: 1, createdAt: -1 }); // 최신순 정렬

export default mongoose.model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);

