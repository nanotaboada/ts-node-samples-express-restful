/**
 * ********************************************************************************
 * Controller
 * ********************************************************************************
 */

import { Request, Response } from 'express';
import playerDatabase from '../data/player-database';

const playerController = {
    getPlayers: (request: Request, response: Response): void => {
        const players = playerDatabase.getAll();
        response.json(players);
    },

    getPlayerBySquadNumber: (request: Request, response: Response): void => {
        const squadNumber = parseInt(request.params.squadNumber);
        const player = playerDatabase.getBySquadNumber(squadNumber);
        if (player) {
            response.json(player);
        } else {
            response.status(404).send('Player not found');
        }
    },
};

export default playerController;
