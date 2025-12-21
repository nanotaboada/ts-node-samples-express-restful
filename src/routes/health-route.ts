import { Router } from 'express';
import { IHealthController } from '../controllers/health-controller-interface.js';
import { IHealthRoute } from './health-route-interface.js';

/**
 * Implementation of IHealthRoute for handling health check routing operations.
 * Provides health status endpoint for monitoring application availability.
 */
export default class HealthRoute implements IHealthRoute {
    public router: Router;
    private readonly healthController: IHealthController;

    constructor(healthController: IHealthController) {
        this.router = Router();
        this.healthController = healthController;
        this.defineRoutes();
    }

    private defineRoutes(): void {
        this.router.get('/health', this.healthController.getHealthStatusAsync.bind(this.healthController));
    }
}
