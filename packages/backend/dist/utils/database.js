"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("../config/env");
class Database {
    constructor() {
        this.isConnected = false;
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    async connect(uri) {
        if (this.isConnected) {
            return;
        }
        try {
            const connectionUri = uri || env_1.config.mongodb.uri;
            await mongoose_1.default.connect(connectionUri);
            this.isConnected = true;
            console.log('Successfully connected to MongoDB');
            mongoose_1.default.connection.on('error', this.handleError);
            mongoose_1.default.connection.on('disconnected', this.handleDisconnect);
        }
        catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }
    async disconnect() {
        if (!this.isConnected) {
            return;
        }
        try {
            await mongoose_1.default.connection.close();
            this.isConnected = false;
            console.log('MongoDB disconnected');
        }
        catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
    handleError(error) {
        console.error('MongoDB error:', error);
    }
    handleDisconnect() {
        console.warn('MongoDB disconnected');
    }
    getConnection() {
        if (!this.isConnected) {
            throw new Error('Database not connected. Call connect() first.');
        }
        return mongoose_1.default.connection;
    }
}
exports.Database = Database;
exports.db = Database.getInstance();
