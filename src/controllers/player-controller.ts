/* -----------------------------------------------------------------------------
 * Controller
 * -------------------------------------------------------------------------- */

import { Request, Response } from 'express';
import playerDatabase from '../data/player-database';
import { Player } from '../models/player-model';

const playerController = {
    getPlayers: (request: Request, response: Response): void => {
        const players = playerDatabase.selectAll();
        response.json(players);
    },
    getPlayerById: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player = playerDatabase.selectById(id);
        if (player) {
            response.json(player);
        } else {
            response.status(404).send('Player not found.');
        }
    },
    getPlayerBySquadNumber: (request: Request, response: Response): void => {
        const squadNumber = parseInt(request.params.squadNumber);
        const player = playerDatabase.selectBySquadNumber(squadNumber);
        if (player) {
            response.json(player);
        } else {
            response.status(404).send('Player not found.');
        }
    },
    postPlayer: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player: Player = request.body;
        if (playerDatabase.selectById(id)) {
            response.status(409).send('Player already exists.');
        } else {
            playerDatabase.insert(player);
            response.status(201).send('Player successfully created.');
        }
    },
    putPlayer: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        const player: Player = request.body;
        if (!playerDatabase.selectById(id)) {
            response.status(404).send('Player not found.');
        } else {
            playerDatabase.update(player);
            response.status(204);
        }
    },
    deletePlayer: (request: Request, response: Response): void => {
        const id = parseInt(request.params.id);
        if (!playerDatabase.selectById(id)) {
            response.status(404).send('Player not found');
        } else {
            playerDatabase.delete(id);
            response.status(204);
        }
    },
};

export default playerController;
