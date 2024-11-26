"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDatabase = exports.Analysis = exports.User = void 0;
var user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
var analysis_1 = require("./analysis");
Object.defineProperty(exports, "Analysis", { enumerable: true, get: function () { return analysis_1.Analysis; } });
// Initialize database connection
const database_1 = require("../utils/database");
// Export database initialization function
const initDatabase = async () => {
    const db = database_1.Database.getInstance();
    await db.connect();
};
exports.initDatabase = initDatabase;
