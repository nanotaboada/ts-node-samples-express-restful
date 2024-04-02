/* -----------------------------------------------------------------------------
 * Route
 * -------------------------------------------------------------------------- */

import express from 'express';
import playerController from '../controllers/player-controller';

const playerRoute = express.Router();

playerRoute.get('/players/', playerController.getAll);
playerRoute.get('/players/:id', playerController.getById);
playerRoute.get('/players/squadNumber/:squadNumber', playerController.getBySquadNumber);
playerRoute.post('/players/', playerController.post);
playerRoute.put('/players/:id', playerController.put);
playerRoute.delete('/players/:id', playerController.delete);

export default playerRoute;
