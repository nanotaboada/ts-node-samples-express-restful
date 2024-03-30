/**
 * ********************************************************************************
 * Route
 * ********************************************************************************
 */

import express from 'express';
import playerController from '../controllers/player-controller';

const playerRoute = express.Router();

playerRoute.get('/players', playerController.getPlayers);
playerRoute.get('/players/:squadNumber', playerController.getPlayerBySquadNumber);

export default playerRoute;
