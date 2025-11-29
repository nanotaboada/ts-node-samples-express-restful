import { Request, Response } from 'express';
import { IHealthController } from './health-controller-interface.js';

/**
 * @openapi
 * tags:
 *   name: Health
 *   description: Health check endpoints
 */
export default class HealthController implements IHealthController {
    /**
     * @openapi
     * /health:
     *   get:
     *     summary: Returns application health and uptime
     *     tags: [Health]
     *     responses:
     *       200:
     *         description: Application is healthy
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 status:
     *                   type: string
     *                   example: OK
     *                 uptime:
     *                   type: number
     *                   example: 123.456
     *                 timestamp:
     *                   type: number
     *                   example: 1716103078993
     */
    async getHealthStatusAsync(request: Request, response: Response): Promise<void> {
        response.status(200).json({
            status: 'OK',
            uptime: process.uptime(),
            timestamp: Date.now(),
        });
    }
}
