import mongoose, { Schema, Document, InferSchemaType } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: string[];
  isActive: boolean;
  profile: {
    name?: string;
    bio?: string;
    profilePicture?: string;
    preferences?: string[];
    dietaryRestrictions?: string[];
    averageRating?: number;
    likesCount?: number;
    followersCount?: number;
  };
}

const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: { type: Boolean, default: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: [String],
  profile: {
    name: String,
    bio: String,
    profilePicture: String,
    preferences: [String],
    dietaryRestrictions: [String],
    averageRating: Number,
    likesCount: Number,
    followersCount: Number,
  },
});

const User = mongoose.model<IUser>('User', userSchema);
export type UserDocument = Document & InferSchemaType<typeof userSchema>;

export default User;
