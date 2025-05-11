import { Request, Response, NextFunction } from 'express';

const SWAGGER_CSP = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com", // Allow Swagger's JS
    "style-src 'self' 'unsafe-inline'", // Required for Swagger UI styles
    "img-src 'self' data:", // Allow embedded image data
].join('; ');

/**
 * Middleware for handling requests to Swagger UI.
 *
 * @param {Request} request - The incoming Request.
 * @param {Response} response - The outgoing Response.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @see {@link https://github.com/swagger-api/swagger-ui/issues?q=Content-Security-Policy+is%3Aopen}
 */
export const swaggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
    response.setHeader('Content-Security-Policy', SWAGGER_CSP);
    next();
};
