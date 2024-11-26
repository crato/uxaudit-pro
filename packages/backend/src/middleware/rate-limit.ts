import rateLimit from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { APIError } from '../utils/errors';

// Rate limit configuration
const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Enable rate limit info in `RateLimit-*` headers
  legacyHeaders: true, // Enable rate limit info in `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again later',
  handler: (req: Request, res: Response, next: NextFunction) => {
    const retryAfter = res.getHeader('Retry-After');
    next(new APIError(429, 'Rate limit exceeded', {
      retryAfter,
      limit: rateLimitConfig.max,
      windowMs: rateLimitConfig.windowMs
    }));
  }
};

// Create rate limiter
export const apiLimiter = rateLimit(rateLimitConfig);

// Rate limit middleware
export const rateLimitMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add custom headers before applying rate limit
  res.setHeader('Access-Control-Expose-Headers', 
    'X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset');
  
  apiLimiter(req, res, next);
};

// Higher rate limits for authenticated users
export const authenticatedLimiter = rateLimit({
  ...rateLimitConfig,
  max: 300, // 300 requests per 15 minutes for authenticated users
  handler: (req: Request, res: Response, next: NextFunction) => {
    const retryAfter = res.getHeader('Retry-After');
    next(new APIError(429, 'Rate limit exceeded for authenticated user', {
      retryAfter,
      limit: 300,
      windowMs: rateLimitConfig.windowMs
    }));
  },
  skip: (req: Request) => {
    return req.user?.subscriptionTier === 'premium';
  }
});