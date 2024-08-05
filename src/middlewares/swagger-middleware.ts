import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/swagger';
import { Request, Response, NextFunction } from 'express';

/**
 * Middleware for handling requests to Swagger UI.
 *
 * @param {Request} request - The incoming Request.
 * @param {Response} response - The outgoing Response.
 * @param {NextFunction} next - The next middleware function in the stack.
 *
 * @see {@link https://github.com/swagger-api/swagger-ui/issues?q=Content-Security-Policy+is%3Aopen}
 */
const swaggerMiddleware = (request: Request, response: Response, next: NextFunction) => {
    response.setHeader('Content-Security-Policy', `script-src 'self'`);
    next();
};

export { swaggerMiddleware, swaggerUi, swaggerSpec };
