const mongoose = require('mongoose');

let isConnected = false;
let isInMemory = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/civicbridge', {
      serverSelectionTimeoutMS: 2000
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    isInMemory = true;
    console.log(`[Database] Local MongoDB not available (${err.message}). Using High-Performance In-Memory Data Store for Hackathon Prototype.`);
  }
};

const getDbState = () => ({ isConnected, isInMemory });

module.exports = { connectDB, getDbState };
