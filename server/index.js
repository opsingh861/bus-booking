import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoute.js'; 
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send('Welcome to the server');
});

app.use('/api/auth', authRoutes); // 
app.use('/api/admin', adminRoutes); // 
app.use('/api/user', userRoutes);

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error(error);
    }
};

const startServer = async () => {
    try {
        await connectDb();
        app.listen(8080, () => {
            console.log('Server running on port 8080');
        });
    } catch (error) {
        console.error(error);
    }
};

startServer();
