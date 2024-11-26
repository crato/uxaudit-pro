"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables from .env file
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
exports.config = {
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/uxaudit-pro',
        options: {
            maxPoolSize: 10,
            minPoolSize: 2,
            maxIdleTimeMS: 30000,
        }
    },
    server: {
        port: parseInt(process.env.PORT || '3001', 10),
        env: process.env.NODE_ENV || 'development',
    }
};
// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI'];
requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
        console.error(`Missing required environment variable: ${envVar}`);
        process.exit(1);
    }
});
