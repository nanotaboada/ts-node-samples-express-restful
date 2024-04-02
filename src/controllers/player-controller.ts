/* -----------------------------------------------------------------------------
 * Controller
 * -------------------------------------------------------------------------- */

import { Request, Response } from 'express';
import playerDatabase from '../data/player-database';
import { Player } from '../models/player-model';

const playerController = {
    getAll: (request: Request, response: Response): void => {
        const players = playerDatabase.selectAll();
        response.json(players);
    },
    getById: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player = playerDatabase.selectById(id);
        if (player) {
            response.json(player);
        } else {
            response.sendStatus(404);
        }
    },
    getBySquadNumber: (request: Request, response: Response): void => {
        const squadNumber = parseInt(request.params.squadNumber);
        const player = playerDatabase.selectBySquadNumber(squadNumber);
        if (player) {
            response.json(player);
        } else {
            response.sendStatus(404);
        }
    },
    post: (request: Request, response: Response): void => {
        const id = parseInt(request.body.id);
        const player: Player = request.body;
        if (Object.keys(player).length !== 0) {
            if (playerDatabase.selectById(id)) {
                response.sendStatus(409);
            } else {
                playerDatabase.insert(player);
                response.sendStatus(201);
            }
        } else {
            response.sendStatus(400);
        }
    },
    put: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player: Player = request.body;
        if (Object.keys(player).length !== 0) {
            if (!playerDatabase.selectById(id)) {
                response.sendStatus(404);
            } else {
                playerDatabase.update(player);
                response.sendStatus(204);
            }
        } else {
            response.sendStatus(400);
        }
    },
    delete: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        if (!playerDatabase.selectById(id)) {
            response.sendStatus(404);
        } else {
            playerDatabase.delete(id);
            response.sendStatus(204);
        }
    },
};

export default playerController;
