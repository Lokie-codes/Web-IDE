import express from 'express';
import cors from 'cors';
import executeRouter from './routes/execute.js';
import gistsRouter from './routes/gists.js';
import projectsRouter from './routes/projects.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
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
    message: 'CodeForge IDE Backend - Phase 2',
    pistonUrl: process.env.PISTON_URL || 'http://localhost:2000',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/execute', executeRouter);
app.use('/api/gists', gistsRouter)
app.use('/api/projects', projectsRouter);

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
