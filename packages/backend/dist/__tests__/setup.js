"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_memory_server_1 = require("mongodb-memory-server");
const database_1 = require("../utils/database");
let mongoServer;
beforeAll(async () => {
    // Create MongoDB Memory Server
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    // Connect using our Database singleton
    await database_1.db.connect(mongoUri);
});
afterAll(async () => {
    // Disconnect and stop server
    await database_1.db.disconnect();
    await mongoServer.stop();
});
beforeEach(async () => {
    // Clear all collections
    const collections = database_1.db.getConnection().collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});
