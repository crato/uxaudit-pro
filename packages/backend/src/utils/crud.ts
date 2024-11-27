import mongoose, { Document, Model } from 'mongoose';
import { APIError } from '@uxaudit-pro/shared';

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Single export for CrudOperations class
export class CrudOperations<T extends Document> {
  constructor(private model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async updateById(id: string, data: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(
        id,
        { $set: data },
        { new: true, runValidators: true }
      ).exec();
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async deleteById(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      return result !== null;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  async findWithPagination(
    query: mongoose.FilterQuery<T> = {},
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<T>> {
    try {
      const page = Math.max(1, options.page || 1);
      const limit = Math.min(100, Math.max(1, options.limit || 10));
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.model
          .find(query)
          .sort(options.sort || { _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean()
          .exec(),
        this.model.countDocuments(query)
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        data: data as T[],
        total,
        page,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  private handleError(error: any): void {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new APIError(400, 'Validation error', error.errors);
    }
    if (error instanceof mongoose.Error.CastError) {
      throw new APIError(400, 'Invalid ID format');
    }
    if (error.code === 11000) { // Duplicate key error
      throw new APIError(409, 'Duplicate entry');
    }
  }
}

// Single export for createCrudHandlers function
export const createCrudHandlers = <T extends Document>(model: Model<T>): CrudOperations<T> => {
  return new CrudOperations<T>(model);
};