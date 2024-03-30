/**
 * ********************************************************************************
 * Controller
 * ********************************************************************************
 */

import { Request, Response } from 'express';
import { Player } from '../models/player-model';
import { seedPlayers } from '../data/players-data';

const playerController = {
    getPlayers: (request: Request, response: Response): void => {
        const players = seedPlayers();
        response.json(players);
    },

    getPlayerBySquadNumber: (request: Request, response: Response): void => {
        const squadNumber = parseInt(request.params.squadNumber);
        const players = seedPlayers();
        const player = players.find((p: Player) => p.squadNumber === squadNumber);
        if (player) {
            response.json(player);
        } else {
            response.status(404).send('Player not found');
        }
    }
};

export default playerController;

