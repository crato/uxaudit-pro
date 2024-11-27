import mongoose from 'mongoose';
import { config } from '../config/env';

export class Database {
  private static instance: Database;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(uri?: string): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      const connectionUri = uri || config.mongodb.uri;
      await mongoose.connect(connectionUri);
      
      this.isConnected = true;
      console.log('Successfully connected to MongoDB');

      mongoose.connection.on('error', this.handleError);
      mongoose.connection.on('disconnected', this.handleDisconnect);

    } catch (error) {
      console.error('MongoDB connection error:', error);
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await mongoose.connection.close();
      this.isConnected = false;
      console.log('MongoDB disconnected');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }

  private handleError(error: Error): void {
    console.error('MongoDB error:', error);
  }

  private handleDisconnect(): void {
    console.warn('MongoDB disconnected');
  }

  public getConnection(): mongoose.Connection {
    if (!this.isConnected) {
      throw new Error('Database not connected. Call connect() first.');
    }
    return mongoose.connection;
  }
}

export const db = Database.getInstance();