import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.warn('MONGO_URI is not set in environment variables - skipping DB connection (development mode)');
      return null;
    }

    const conn = await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    console.log('✅ MongoDB Connected Successfully');
    console.log('Connected to:', mongoose.connection.name);
    console.log(`Connected to: ${conn.connection.host}`);

    // Add connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ MongoDB Connected Successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB Disconnected');
    });

    return conn;
  } catch (error) {
    console.error('❌ Database connection error:', error.message || error);
    // Don't exit, just throw the error to be handled by caller
    throw error;
  }
};

export default connectDB;