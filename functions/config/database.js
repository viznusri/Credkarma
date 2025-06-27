const mongoose = require('mongoose');
const functions = require('firebase-functions');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    // Use Firebase Functions config for production, or .env for local development
    const mongoUri = functions.config().mongodb?.uri || process.env.MONGODB_URI;
    
    if (!mongoUri) {
      throw new Error('MongoDB URI not configured');
    }

    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

module.exports = connectDB;