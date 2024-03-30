/**
 * ********************************************************************************
 * Controller
 * ********************************************************************************
 */

import { Request, Response } from 'express';
import { Player } from '../models/player-model';
import { seedPlayers } from '../data/players-data';

const playerController = {
    getPlayers: (req: Request, res: Response): void => {
        const players = seedPlayers();
        res.json(players);
    },

    getPlayerBySquadNumber: (req: Request, res: Response): void => {
        const squadNumber = parseInt(req.params.squadNumber);
        const players = seedPlayers();
        const player = players.find((p: Player) => p.squadNumber === squadNumber);
        if (player) {
            res.json(player);
        } else {
            res.status(404).send('Player not found');
        }
    }
};

export default playerController;

