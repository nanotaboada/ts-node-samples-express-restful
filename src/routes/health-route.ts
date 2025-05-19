import { Router } from 'express';
import { IHealthController } from '../controllers/health-controller-interface';
import { IHealthRoute } from './health-route-interface';

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
