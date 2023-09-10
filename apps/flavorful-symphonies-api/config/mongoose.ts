import mongoose from 'mongoose';
import { mongoUri } from './vars';

mongoose.connect(mongoUri);

const db = mongoose.connection;
const connectToDatabase = async () => {
  db.on('connected', () => {
    console.log(`Connected to MongoDB at ${mongoUri}`);
  });

  db.on('error', (err) => {
    console.error(`MongoDB connection error: ${err}`);
  });

  db.on('disconnected', () => {
    console.log('MongoDB disconnected');
  });
};

export default connectToDatabase;
