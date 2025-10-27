import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    // Try to connect to DB but don't fail if it doesn't work
    try {
      await connectDB();
    } catch (dbError) {
      console.warn('⚠️ Database connection failed - running in API-only mode');
      console.warn('Database error:', dbError.message);
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

start();
