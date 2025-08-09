import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import { setupGameHandlers } from './game/handlers';
import { setupAuthMiddleware } from './auth/middleware';
import apiRouter from './api/router';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  },
});

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());

// Auth middleware
setupAuthMiddleware(app);

// API routes
app.use('/api', apiRouter);

// WebSocket handlers
setupGameHandlers(io);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`🎲 Seven Wonders server running on port ${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(
    `🌐 CORS enabled for ${process.env.CLIENT_URL || 'http://localhost:3000'}`
  );
});
