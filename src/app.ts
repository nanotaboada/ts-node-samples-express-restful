/**
 * ********************************************************************************
 * Application
 * ********************************************************************************
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import playerRoute from './routes/player-route';
import logger from './utils/logger';

dotenv.config();

const app = express();

/**
 * ********************************************************************************
 * Middlewares
 * ********************************************************************************
 */

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());

// Sample middleware to log incoming requests
app.use((request, response, next) => {
    logger.debug(`[Request] URI: ${request.method} ${request.url}`);
    logger.debug('[Request] Query Parameters: ' + JSON.stringify(request.query));
    logger.debug('[Request] Headers: ' + JSON.stringify(request.headers));
    logger.debug('[Request] Body: ' + JSON.stringify(request.body));
    next(); // Call the next middleware in the stack
});

app.use('/', playerRoute);

export default app;
