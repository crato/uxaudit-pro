/**
 * Custom API Error class
 */
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'APIError';
  }
}

/**
 * Custom Validation Error class
 */
export class ValidationError extends Error {
  constructor(
    message: string,
    public field: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Error codes enum
 */
export enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
}

/**
 * Creates a standardized error response
 */
export const createErrorResponse = (
  code: ErrorCode,
  message: string,
  details?: Record<string, unknown>
) => ({
  error: {
    code,
    message,
    details,
  },
});