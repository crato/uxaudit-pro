"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrudHandlers = exports.CrudOperations = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const shared_1 = require("@uxaudit-pro/shared");
// Single export for CrudOperations class
class CrudOperations {
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        try {
            const document = new this.model(data);
            return await document.save();
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async findById(id) {
        try {
            return await this.model.findById(id).exec();
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async updateById(id, data) {
        try {
            return await this.model.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true }).exec();
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async deleteById(id) {
        try {
            const result = await this.model.findByIdAndDelete(id).exec();
            return result !== null;
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    async findWithPagination(query = {}, options = {}) {
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
                data: data,
                total,
                page,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            };
        }
        catch (error) {
            this.handleError(error);
            throw error;
        }
    }
    handleError(error) {
        if (error instanceof mongoose_1.default.Error.ValidationError) {
            throw new shared_1.APIError(400, 'Validation error', error.errors);
        }
        if (error instanceof mongoose_1.default.Error.CastError) {
            throw new shared_1.APIError(400, 'Invalid ID format');
        }
        if (error.code === 11000) { // Duplicate key error
            throw new shared_1.APIError(409, 'Duplicate entry');
        }
    }
}
exports.CrudOperations = CrudOperations;
// Single export for createCrudHandlers function
const createCrudHandlers = (model) => {
    return new CrudOperations(model);
};
exports.createCrudHandlers = createCrudHandlers;
