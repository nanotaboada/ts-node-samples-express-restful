import { RequestHandler } from 'express';

/**
 * Interface for rate limiting middleware.
 *
 * Defines two rate limiters with different strictness levels:
 * - generalLimiter: Applied to all routes for general API access control
 * - strictLimiter: Applied to write operations (POST, PUT, DELETE) for enhanced protection
 */
export interface IRateLimiter {
    /**
     * General rate limiter for read operations.
     * Default configuration: 100 requests per minute per IP.
     */
    generalLimiter: RequestHandler;

    /**
     * Strict rate limiter for write operations (POST, PUT, DELETE).
     * Default configuration: 20 requests per minute per IP.
     */
    strictLimiter: RequestHandler;
}
