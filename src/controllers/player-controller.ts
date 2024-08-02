/* -----------------------------------------------------------------------------
 * Controller
 * -------------------------------------------------------------------------- */

import { Request, Response } from 'express';
import playerService from '../services/player-service';
import { Player } from '../models/player-model';

/**
 * @swagger
 * tags:
 *   name: Players
 */

const playerController = {
    /**
     * @swagger
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
    getAllAsync: async (request: Request, response: Response): Promise<void> => {
        const players = await playerService.retrieveAllAsync();
        response.json(players);
    },
    /**
     * @swagger
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
    getByIdAsync: async (request: Request, response: Response): Promise<void> => {
        const id = parseInt(request.params.id);
        const player = await playerService.retrieveByIdAsync(id);
        if (player) {
            response.json(player);
        } else {
            response.sendStatus(404);
        }
    },
    /**
     * @swagger
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
    getBySquadNumberAsync: async (request: Request, response: Response): Promise<void> => {
        const squadNumber = parseInt(request.params.squadNumber);
        const player = await playerService.retrieveBySquadNumberAsync(squadNumber);
        if (player) {
            response.json(player);
        } else {
            response.sendStatus(404);
        }
    },
    /**
     * @swagger
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
    postAsync: async (request: Request, response: Response): Promise<void> => {
        const id = parseInt(request.body.id);
        const create: Player = request.body;
        if (Object.keys(create).length !== 0) {
            const player = await playerService.retrieveByIdAsync(id);
            if (player) {
                response.sendStatus(409);
            } else {
                await playerService.createAsync(create);
                response.sendStatus(201);
            }
        } else {
            response.sendStatus(400);
        }
    },
    /**
     * @swagger
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
    putAsync: async (request: Request, response: Response): Promise<void> => {
        const id = parseInt(request.params.id);
        const update: Player = request.body;
        if (Object.keys(update).length !== 0) {
            const player = await playerService.retrieveByIdAsync(id);
            if (!player) {
                response.sendStatus(404);
            } else {
                await playerService.updateAsync(update);
                response.sendStatus(204);
            }
        } else {
            response.sendStatus(400);
        }
    },
    /**
     * @swagger
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
    deleteAsync: async (request: Request, response: Response): Promise<void> => {
        const id = parseInt(request.params.id);
        const player = await playerService.retrieveByIdAsync(id);
        if (!player) {
            response.sendStatus(404);
        } else {
            await playerService.deleteAsync(id);
            response.sendStatus(204);
        }
    },
};

export default playerController;
