require('dotenv').config();
const mongoose = require('mongoose');

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce-db',
  jwtSecret: process.env.JWT_SECRET || 'super_secret_jwt_key_default',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { config, connectDB };
