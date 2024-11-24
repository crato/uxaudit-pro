import { db } from './utils/database';
import { config } from './config/env';

async function startServer() {
  try {
    // Connect to database
    await db.connect();
    
    console.log(`Server environment: ${config.server.env}`);
    console.log(`Server ready on port ${config.server.port}`);
    
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();