import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/:[^:/@]+@/, ':****@')); // Hide password in logs
        
        await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('Successfully connected to MongoDB!');
        console.log('Database name:', mongoose.connection.name);
        console.log('Host:', mongoose.connection.host);
        
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Connection error:', error.message);
        console.error('Full error:', error);
    }
}

testConnection();
