import mongoose, { Schema, Document } from 'mongoose';

// Define the interface representing a User document
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: string[];
  profile: {
    name: string;
    bio: string;
    profilePicture: string;
    preferences: string[];
    dietaryRestrictions: string[];
    averageRating: number;
    likesCount: number;
    followersCount: number;
  };
}

// Define the schema for the User model
const userSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
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

// Create and export the User model
const User = mongoose.model<IUser>('User', userSchema);

export default User;
