import rateLimit, { type RateLimitRequestHandler } from 'express-rate-limit';
import { IRateLimiter } from './rate-limiter-interface.js';

/**
 * Rate limiting middleware implementation using express-rate-limit.
 *
 * Provides two rate limiters with different strictness levels:
 * - generalLimiter: Applied to all routes (100 requests per minute by default)
 * - strictLimiter: Applied to write operations (20 requests per minute by default)
 *
 * Configuration via environment variables:
 * - RATE_LIMIT_WINDOW_MS: Time window in milliseconds (default: 60000 = 1 minute)
 * - RATE_LIMIT_MAX_GENERAL: Max requests for general limiter per window (default: 100 per minute)
 * - RATE_LIMIT_MAX_STRICT: Max requests for strict limiter per window (default: 20 per minute)
 * - RATE_LIMIT_ENABLED: Set to 'false' to completely disable rate limiting (useful for tests)
 *
 * @see {@link https://www.npmjs.com/package/express-rate-limit}
 */
export default class RateLimiter implements IRateLimiter {
    /**
     * General rate limiter for all API endpoints.
     * Default: 100 requests per minute per IP.
     * Can be disabled by setting RATE_LIMIT_ENABLED=false
     */
    public readonly generalLimiter: RateLimitRequestHandler;

    /**
     * Strict rate limiter for write operations (POST, PUT, DELETE).
     * Default: 20 requests per minute per IP.
     * Can be disabled by setting RATE_LIMIT_ENABLED=false
     */
    public readonly strictLimiter: RateLimitRequestHandler;

    constructor() {
        const windowMs = Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10); // 1 minute
        const maxGeneral = Number.parseInt(process.env.RATE_LIMIT_MAX_GENERAL || '100', 10);
        const maxStrict = Number.parseInt(process.env.RATE_LIMIT_MAX_STRICT || '20', 10);
        const isEnabled = process.env.RATE_LIMIT_ENABLED !== 'false';

        this.generalLimiter = rateLimit({
            windowMs: windowMs,
            max: maxGeneral,
            standardHeaders: true,
            legacyHeaders: false,
            skip: () => !isEnabled,
            message: {
                status: 429,
                error: 'Too many requests. Please try again later.',
            },
        });

        this.strictLimiter = rateLimit({
            windowMs: windowMs,
            max: maxStrict,
            standardHeaders: true,
            legacyHeaders: false,
            skip: () => !isEnabled,
            message: {
                status: 429,
                error: 'Too many write requests. Please try again later.',
            },
        });
    }
}
