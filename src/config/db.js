const mongoose = require('mongoose');
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      retryWrites: true,
    });
    console.log('BBDD Conectada...');
  }
  catch (error) {
    console.error('error: ${error.message}');
    process.exit(1);
  }
};

mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Attempting to reconnect...');
});

module.exports = { connectDB };