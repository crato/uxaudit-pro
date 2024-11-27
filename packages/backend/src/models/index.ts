export { User, UserDocument } from './user';
export { Analysis, AnalysisDocument } from './analysis';

// Initialize database connection
import { Database } from '../utils/database';
import { config } from '../config/env';

// Export database initialization function
export const initDatabase = async (): Promise<void> => {
  const db = Database.getInstance();
  await db.connect();
};