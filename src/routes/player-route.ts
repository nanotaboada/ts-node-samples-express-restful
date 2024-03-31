/* -----------------------------------------------------------------------------
 * Route
 * -------------------------------------------------------------------------- */

import express from 'express';
import playerController from '../controllers/player-controller';

const playerRoute = express.Router();

playerRoute.get('/players', playerController.getPlayers);
playerRoute.get('/players/:id', playerController.getPlayerById);
playerRoute.get('/players/squadNumber/:squadNumber', playerController.getPlayerBySquadNumber);
playerRoute.post('/players', playerController.postPlayer);
playerRoute.put('/players/:id', playerController.putPlayer);
playerRoute.delete('/players/:id', playerController.deletePlayer);

export default playerRoute;
