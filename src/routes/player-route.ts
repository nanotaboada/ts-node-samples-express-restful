/* -----------------------------------------------------------------------------
 * Route
 * -------------------------------------------------------------------------- */

import express from 'express';
import playerController from '../controllers/player-controller';

const playerRoute = express.Router();

playerRoute.get('/players/', playerController.getAllAsync);
playerRoute.get('/players/:id', playerController.getByIdAsync);
playerRoute.get('/players/squadNumber/:squadNumber', playerController.getBySquadNumberAsync);
playerRoute.post('/players/', playerController.postAsync);
playerRoute.put('/players/:id', playerController.putAsync);
playerRoute.delete('/players/:id', playerController.deleteAsync);

export default playerRoute;
