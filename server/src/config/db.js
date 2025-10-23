const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error('MONGO_URI is not set in environment variables');
    }
    
    const conn = await mongoose.connect(uri);

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
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;