import express from 'express';
import { db } from './utils';
import { analysisEngine } from './services/analysis/engine';
import analysisRoutes from './routes/analysis';
import { APIError } from '@uxaudit-pro/shared';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', analysisRoutes);

// Error handling middleware
const errorHandler: express.ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      error: err.message,
      details: err.details
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error'
  });
  return;
};

app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await db.connect();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();