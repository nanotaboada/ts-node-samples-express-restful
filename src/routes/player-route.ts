import { IPlayerRoute } from '../routes/player-route-interface';
import { IPlayerController } from '../controllers/player-controller-interface';
import { Router } from 'express';

/**
 * Implementation of IPlayerRoute for handing the routing operations of a Player.
 */
export default class PlayerRoute implements IPlayerRoute {
    public router: Router;
    private readonly playerController: IPlayerController;

    constructor(playerController: IPlayerController) {
        this.router = Router();
        this.playerController = playerController;
        this.defineRoutes();
    }

    private defineRoutes() {
        this.router.get('/players/', this.playerController.getAllAsync.bind(this.playerController));
        this.router.get('/players/:id', this.playerController.getByIdAsync.bind(this.playerController));
        this.router.get(
            '/players/squadNumber/:squadNumber',
            this.playerController.getBySquadNumberAsync.bind(this.playerController),
        );
        this.router.post('/players/', this.playerController.postAsync.bind(this.playerController));
        this.router.put('/players/:id', this.playerController.putAsync.bind(this.playerController));
        this.router.delete('/players/:id', this.playerController.deleteAsync.bind(this.playerController));
    }
}
