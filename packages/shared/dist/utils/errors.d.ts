/**
 * Custom API Error class
 */
export declare class APIError extends Error {
    statusCode: number;
    details?: Record<string, unknown> | undefined;
    constructor(statusCode: number, message: string, details?: Record<string, unknown> | undefined);
}
/**
 * Custom Validation Error class
 */
export declare class ValidationError extends Error {
    field: string;
    value?: unknown | undefined;
    constructor(message: string, field: string, value?: unknown | undefined);
}
/**
 * Error codes enum
 */
export declare enum ErrorCode {
    UNAUTHORIZED = "UNAUTHORIZED",
    FORBIDDEN = "FORBIDDEN",
    NOT_FOUND = "NOT_FOUND",
    VALIDATION_ERROR = "VALIDATION_ERROR",
    SERVER_ERROR = "SERVER_ERROR"
}
/**
 * Creates a standardized error response
 */
export declare const createErrorResponse: (code: ErrorCode, message: string, details?: Record<string, unknown>) => {
    error: {
        code: ErrorCode;
        message: string;
        details: Record<string, unknown> | undefined;
    };
};
