import { IPlayerRoute } from '../routes/player-route-interface.js';
import { IPlayerController } from '../controllers/player-controller-interface.js';
import { IPlayerValidator } from '../middlewares/player-validator-interface.js';
import { Router } from 'express';

/**
 * Implementation of IPlayerRoute for handing the routing operations of a Player.
 */
export default class PlayerRoute implements IPlayerRoute {
    public router: Router;
    private readonly playerController: IPlayerController;
    private readonly playerValidator: IPlayerValidator;

    constructor(playerController: IPlayerController, playerValidator: IPlayerValidator) {
        this.router = Router();
        this.playerController = playerController;
        this.playerValidator = playerValidator;
        this.defineRoutes();
    }

    private defineRoutes() {
        this.router.get('/players/', this.playerController.getAllAsync.bind(this.playerController));
        this.router.get('/players/:id', this.playerController.getByIdAsync.bind(this.playerController));
        this.router.get(
            '/players/squadNumber/:squadNumber',
            this.playerController.getBySquadNumberAsync.bind(this.playerController),
        );
        this.router.post(
            '/players/',
            this.playerValidator.validationChain,
            this.playerValidator.validate.bind(this.playerValidator),
            this.playerController.postAsync.bind(this.playerController),
        );
        this.router.put(
            '/players/:id',
            this.playerValidator.validationChain,
            this.playerValidator.validate.bind(this.playerValidator),
            this.playerController.putAsync.bind(this.playerController),
        );
        this.router.delete('/players/:id', this.playerController.deleteAsync.bind(this.playerController));
    }
}
