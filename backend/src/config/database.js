const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log(`📍 MongoDB URI configured: ${process.env.MONGODB_URI ? '✅ Yes' : '❌ No'}`);

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB connected successfully: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    console.error('⚠️  Stack trace:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
