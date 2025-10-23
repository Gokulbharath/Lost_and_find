const mongoose = require('mongoose');

/**
 * MongoDB connection configuration
 * Handles connection to MongoDB database using Mongoose
 */
const connectDB = async () => {
  try {
    const uri = "mongodb+srv://muthumanikandan11mk:Mk11%402004@mycluster.1gybapu.mongodb.net/?retryWrites=true&w=majority&appName=MyCluster";
    if (!uri) {
      throw new Error('MONGO_URI is not set in environment variables');
    }
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;