import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './User';

export interface IProject extends Document {
  user: IUser['_id'];
  title: string;
  startDate: Date;
  endDate: Date;
  status: 'planning' | 'active' | 'completed'; // 기획중, 진행중, 완료
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema = new Schema(
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
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['planning', 'active', 'completed'],
      default: 'active',
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// 인덱스 설정: 특정 사용자의 프로젝트를 날짜순으로 조회할 때 성능 최적화
ProjectSchema.index({ user: 1, startDate: 1 });

export default mongoose.model<IProject>('Project', ProjectSchema);

