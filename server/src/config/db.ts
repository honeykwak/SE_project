import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    console.log(`[server]: Env MONGO_URI is: ${mongoURI ? 'Set' : 'Undefined/Null'}`);
    if (mongoURI) {
        console.log(`[server]: URI starts with: ${mongoURI.substring(0, 15)}...`);
    } else {
        console.log(`[server]: Using fallback localhost URI`);
    }
    const finalURI = mongoURI || 'mongodb://localhost:27017/syncup';
    
    const conn = await mongoose.connect(finalURI);
    console.log(`[server]: MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[server]: Error connecting to MongoDB`, error);
    process.exit(1);
  }
};

export default connectDB;

