import { MongoMemoryServer } from 'mongodb-memory-server';
import { db } from '../utils/database';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Create MongoDB Memory Server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect using our Database singleton
  await db.connect(mongoUri);
});

afterAll(async () => {
  // Disconnect and stop server
  await db.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  // Clear all collections
  const collections = db.getConnection().collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});