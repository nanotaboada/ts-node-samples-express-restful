import { IPlayer } from '../models/player-interface.js';
import { IPlayerController } from './player-controller-interface.js';
import { IPlayerService } from '../services/player-service-interface.js';
import { Request, Response } from 'express';
import logger from '../utils/logger.js';

/**
 * Implementation of IPlayerController for handling Player HTTP request operations.
 * Manages all player-related endpoints including CRUD operations.
 *
 * @openapi
 * tags:
 *   name: Players
 */
export default class PlayerController implements IPlayerController {
    private readonly playerService: IPlayerService;

    constructor(playerService: IPlayerService) {
        this.playerService = playerService;
    }

    /**
     * @openapi
     * /players:
     *   get:
     *     summary: Retrieves all players
     *     tags: [Players]
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/Player'
     */
    async getAllAsync(request: Request, response: Response): Promise<void> {
        logger.info({ action: 'retrieveAllPlayers' }, 'Retrieving all players');
        const players = await this.playerService.retrieveAllAsync();
        logger.info({ playerCount: players.length }, 'Players retrieved successfully');
        response.json(players);
    }

    /**
     * @openapi
     * /players/{id}:
     *   get:
     *     summary: Retrieves a Player by its ID
     *     tags: [Players]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: string
     *           format: uuid
     *         required: true
     *         description: Player.id (UUID, admin use only)
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Player'
     *       404:
     *         description: Not Found
     */
    async getByIdAsync(request: Request, response: Response): Promise<void> {
        const id = request.params.id;
        logger.info({ playerId: id, action: 'retrieveById' }, 'Retrieving player by ID');
        const player = await this.playerService.retrieveByIdAsync(id);
        if (player) {
            logger.info({ playerId: id, status: 'found' }, 'Player found');
            response.json(player);
        } else {
            logger.warn({ playerId: id, status: 'not_found' }, 'Player not found');
            response.sendStatus(404);
        }
    }

    /**
     * @openapi
     * /players/squadNumber/{squadNumber}:
     *   get:
     *     summary: Retrieves a Player by its Squad Number
     *     tags: [Players]
     *     parameters:
     *       - in: path
     *         name: squadNumber
     *         schema:
     *           type: integer
     *         required: true
     *         description: Player.squadNumber
     *     responses:
     *       200:
     *         description: OK
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/Player'
     *       404:
     *         description: Not Found
     */
    async getBySquadNumberAsync(request: Request, response: Response): Promise<void> {
        const squadNumber = Number.parseInt(request.params.squadNumber);
        logger.info({ squadNumber, action: 'retrieveBySquadNumber' }, 'Retrieving player by squad number');
        const player = await this.playerService.retrieveBySquadNumberAsync(squadNumber);
        if (player) {
            logger.info({ squadNumber, status: 'found' }, 'Player found');
            response.json(player);
        } else {
            logger.warn({ squadNumber, status: 'not_found' }, 'Player not found');
            response.sendStatus(404);
        }
    }

    /**
     * @openapi
     * /players:
     *   post:
     *     summary: Creates a new Player
     *     tags: [Players]
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Player'
     *     responses:
     *       201:
     *         description: Created
     *       400:
     *         description: Bad Request
     *       409:
     *         description: Conflict
     */
    async postAsync(request: Request, response: Response): Promise<void> {
        const create: IPlayer = request.body;
        logger.info({ squadNumber: create.squadNumber, action: 'createPlayer' }, 'Creating new player');
        const player = await this.playerService.retrieveBySquadNumberAsync(create.squadNumber);
        if (player) {
            logger.warn({ squadNumber: create.squadNumber, status: 'conflict' }, 'Player already exists');
            response.sendStatus(409);
        } else {
            await this.playerService.createAsync(create);
            logger.info({ squadNumber: create.squadNumber, status: 'created' }, 'Player created successfully');
            response.sendStatus(201);
        }
    }

    /**
     * @openapi
     * /players/squadNumber/{squadNumber}:
     *   put:
     *     summary: Updates (entirely) a Player by its Squad Number
     *     tags: [Players]
     *     parameters:
     *       - in: path
     *         name: squadNumber
     *         schema:
     *           type: integer
     *         required: true
     *         description: Player.squadNumber
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             $ref: '#/components/schemas/Player'
     *     responses:
     *       204:
     *         description: No Content
     *       400:
     *         description: Bad Request
     *       404:
     *         description: Not Found
     */
    async putAsync(request: Request, response: Response): Promise<void> {
        const squadNumber = Number.parseInt(request.params.squadNumber);
        const update: IPlayer = request.body;
        logger.info({ squadNumber, action: 'updatePlayer' }, 'Updating player');
        const player = await this.playerService.retrieveBySquadNumberAsync(squadNumber);
        if (player) {
            await this.playerService.updateAsync({ ...update, squadNumber });
            logger.info({ squadNumber, status: 'updated' }, 'Player updated successfully');
            response.sendStatus(204);
        } else {
            logger.warn({ squadNumber, status: 'not_found' }, 'Player not found for update');
            response.sendStatus(404);
        }
    }

    /**
     * @openapi
     * /players/squadNumber/{squadNumber}:
     *   delete:
     *     summary: Deletes a Player by its Squad Number
     *     tags: [Players]
     *     parameters:
     *       - in: path
     *         name: squadNumber
     *         schema:
     *           type: integer
     *         required: true
     *         description: Player.squadNumber
     *     responses:
     *       204:
     *         description: No Content
     *       404:
     *         description: Not Found
     */
    async deleteAsync(request: Request, response: Response): Promise<void> {
        const squadNumber = Number.parseInt(request.params.squadNumber);
        logger.info({ squadNumber, action: 'deletePlayer' }, 'Deleting player');
        const player = await this.playerService.retrieveBySquadNumberAsync(squadNumber);
        if (player) {
            await this.playerService.deleteAsync(squadNumber);
            logger.info({ squadNumber, status: 'deleted' }, 'Player deleted successfully');
            response.sendStatus(204);
        } else {
            logger.warn({ squadNumber, status: 'not_found' }, 'Player not found for deletion');
            response.sendStatus(404);
        }
    }
}
