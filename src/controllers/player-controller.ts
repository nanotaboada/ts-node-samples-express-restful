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
    getAll: (request: Request, response: Response): void => {
        const players = playerService.retrieveAll();
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
    getById: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player = playerService.retrieveById(id);
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
    getBySquadNumber: (request: Request, response: Response): void => {
        const squadNumber = parseInt(request.params.squadNumber);
        const player = playerService.retrieveBySquadNumber(squadNumber);
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
    post: (request: Request, response: Response): void => {
        const id = parseInt(request.body.id);
        const player: Player = request.body;
        if (Object.keys(player).length !== 0) {
            if (playerService.retrieveById(id)) {
                response.sendStatus(409);
            } else {
                playerService.create(player);
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
    put: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player: Player = request.body;
        if (Object.keys(player).length !== 0) {
            if (!playerService.retrieveById(id)) {
                response.sendStatus(404);
            } else {
                playerService.update(player);
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
    delete: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        if (!playerService.retrieveById(id)) {
            response.sendStatus(404);
        } else {
            playerService.delete(id);
            response.sendStatus(204);
        }
    },
};

export default playerController;
