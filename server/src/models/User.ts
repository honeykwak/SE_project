import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  username: string;
  password: string;
  name: string;
  role: string;      // Changed from jobTitle
  bio: string;       // Changed from introduction
  tags: string[];    // Added
  avatarUrl: string; // Added
  location: string;
  availability: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      default: 'Freelancer',
    },
    bio: {
      type: String,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    avatarUrl: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: 'Seoul, Korea',
    },
    availability: {
      type: String,
      default: 'Available for new projects',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUser>('User', UserSchema);

