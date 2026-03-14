// server.js

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js'; // Import user routes
import eventRoutes from './routes/eventRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();
connectDB();

const app = express();

// CORS configuration — allows frontend to send cookies
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// This middleware is crucial for parsing JSON in the body of requests
app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT || 5000;

// Mount the user routes on the '/api/users' path
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use('/api/notifications', notificationRoutes);


app.get('/', (req, res) => {
  res.send('ClubSphere API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});