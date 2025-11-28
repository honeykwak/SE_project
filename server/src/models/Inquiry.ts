import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IInquiry extends Document {
  user: IUser['_id']; // 수신자 (프리랜서)
  senderName: string;
  senderEmail: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    senderName: {
      type: String,
      required: true,
      trim: true,
    },
    senderEmail: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

InquirySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model<IInquiry>('Inquiry', InquirySchema);

