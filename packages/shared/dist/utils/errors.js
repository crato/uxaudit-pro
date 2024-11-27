"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createErrorResponse = exports.ErrorCode = exports.ValidationError = exports.APIError = void 0;
/**
 * Custom API Error class
 */
class APIError extends Error {
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.name = 'APIError';
    }
}
exports.APIError = APIError;
/**
 * Custom Validation Error class
 */
class ValidationError extends Error {
    constructor(message, field, value) {
        super(message);
        this.field = field;
        this.value = value;
        this.name = 'ValidationError';
    }
}
exports.ValidationError = ValidationError;
/**
 * Error codes enum
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorCode["SERVER_ERROR"] = "SERVER_ERROR";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
/**
 * Creates a standardized error response
 */
const createErrorResponse = (code, message, details) => ({
    error: {
        code,
        message,
        details,
    },
});
exports.createErrorResponse = createErrorResponse;
