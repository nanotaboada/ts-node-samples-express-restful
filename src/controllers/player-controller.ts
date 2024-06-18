/* -----------------------------------------------------------------------------
 * Controller
 * -------------------------------------------------------------------------- */

import { Request, Response } from 'express';
import playerService from '../services/player-service';
import { Player } from '../models/player-model';

const playerController = {
    getAll: (request: Request, response: Response): void => {
        const players = playerService.retrieveAll();
        response.json(players);
    },
    getById: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player = playerService.retrieveById(id);
        if (player) {
            response.json(player);
        } else {
            response.sendStatus(404);
        }
    },
    getBySquadNumber: (request: Request, response: Response): void => {
        const squadNumber = parseInt(request.params.squadNumber);
        const player = playerService.retrieveBySquadNumber(squadNumber);
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
