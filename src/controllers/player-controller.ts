import Player from '../models/player-model.js';
import { IPlayerController } from './player-controller-interface.js';
import { IPlayerService } from '../services/player-service-interface.js';
import { Request, Response } from 'express';

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
        const players = await this.playerService.retrieveAllAsync();
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
     *           type: integer
     *         required: true
     *         description: Player.id
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
        const id = Number.parseInt(request.params.id);
        const player = await this.playerService.retrieveByIdAsync(id);
        if (player) {
            response.json(player);
        } else {
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
        const player = await this.playerService.retrieveBySquadNumberAsync(squadNumber);
        if (player) {
            response.json(player);
        } else {
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
        const id = parseInt(request.body.id);
        const create: Player = request.body;
        const player = await this.playerService.retrieveByIdAsync(id);
        if (player) {
            response.sendStatus(409);
        } else {
            await this.playerService.createAsync(create);
            response.sendStatus(201);
        }
    }

    /**
     * @openapi
     * /players/{id}:
     *   put:
     *     summary: Updates (entirely) a Player by its ID
     *     tags: [Players]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Player.id
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
        const id = Number.parseInt(request.params.id);
        const update: Player = request.body;
        const player = await this.playerService.retrieveByIdAsync(id);
        if (!player) {
            response.sendStatus(404);
        } else {
            await this.playerService.updateAsync(update);
            response.sendStatus(204);
        }
    }

    /**
     * @openapi
     * /players/{id}:
     *   delete:
     *     summary: Deletes a Player by its ID
     *     tags: [Players]
     *     parameters:
     *       - in: path
     *         name: id
     *         schema:
     *           type: integer
     *         required: true
     *         description: Player.id
     *     responses:
     *       204:
     *         description: No Content
     *       404:
     *         description: Not Found
     */
    async deleteAsync(request: Request, response: Response): Promise<void> {
        const id = Number.parseInt(request.params.id);
        const player = await this.playerService.retrieveByIdAsync(id);
        if (!player) {
            response.sendStatus(404);
        } else {
            await this.playerService.deleteAsync(id);
            response.sendStatus(204);
        }
    }
}
