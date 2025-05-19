import { Request, Response } from 'express';

/**
 * Interface that defines the operations of a Health controller.
 */
export interface IHealthController {
    /**
     * Handles the route "GET /health" to retrieve the app health status.
     * @param {Request} request - The incoming Request.
     * @param {Response} response - The outgoing Response.
     */
    getHealthStatusAsync(request: Request, response: Response): Promise<void>;
}
