"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticatedLimiter = exports.rateLimitMiddleware = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const errors_1 = require("../utils/errors");
// Rate limit configuration
const rateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Enable rate limit info in `RateLimit-*` headers
    legacyHeaders: true, // Enable rate limit info in `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again later',
    handler: (req, res, next) => {
        const retryAfter = res.getHeader('Retry-After');
        next(new errors_1.APIError(429, 'Rate limit exceeded', {
            retryAfter,
            limit: rateLimitConfig.max,
            windowMs: rateLimitConfig.windowMs
        }));
    }
};
// Create rate limiter
exports.apiLimiter = (0, express_rate_limit_1.default)(rateLimitConfig);
// Rate limit middleware
const rateLimitMiddleware = (req, res, next) => {
    // Add custom headers before applying rate limit
    res.setHeader('Access-Control-Expose-Headers', 'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset');
    (0, exports.apiLimiter)(req, res, next);
};
exports.rateLimitMiddleware = rateLimitMiddleware;
// Higher rate limits for authenticated users
exports.authenticatedLimiter = (0, express_rate_limit_1.default)({
    ...rateLimitConfig,
    max: 300, // 300 requests per 15 minutes for authenticated users
    handler: (req, res, next) => {
        const retryAfter = res.getHeader('Retry-After');
        next(new errors_1.APIError(429, 'Rate limit exceeded for authenticated user', {
            retryAfter,
            limit: 300,
            windowMs: rateLimitConfig.windowMs
        }));
    },
    skip: (req) => {
        return req.user?.subscriptionTier === 'premium';
    }
});
