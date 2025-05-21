import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        console.log('MongoDB URI:', process.env.MONGODB_URI.replace(/:[^:/@]+@/, ':****@')); // Hide password in logs
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('Successfully connected to MongoDB!');
        console.log('Database name:', conn.connection.name);
        console.log('Host:', conn.connection.host);
        return conn;
    } catch (error) {
        console.error('Connection error:', error.message);
        console.error('Full error:', error);
        process.exit(1);
    }
};

export default connectDB;
