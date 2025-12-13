import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import executeRouter from './routes/execute.js';
import gistsRouter from './routes/gists.js';
import projectsRouter from './routes/projects.js';
import aiRouter from './routes/ai.js';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS with environment variable
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'CodeForge IDE Backend - Phase 5',
    pistonUrl: process.env.PISTON_URL || 'http://localhost:2000',
    timestamp: new Date().toISOString()
  });
});


app.use('/api/execute', executeRouter);
app.use('/api/gists', gistsRouter)
app.use('/api/projects', projectsRouter);
app.use('/api/ai', aiRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 CodeForge Backend running on http://localhost:${PORT}`);
  console.log(`📡 Piston URL: ${process.env.PISTON_URL || 'http://localhost:2000'}`);
  console.log(`💾 Database: SQLite`);
});
