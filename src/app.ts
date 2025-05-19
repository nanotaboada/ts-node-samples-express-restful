/* -----------------------------------------------------------------------------
 * Application
 * -------------------------------------------------------------------------- */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import PlayerDatabase from './database/player-database';
import PlayerService from './services/player-service';
import PlayerController from './controllers/player-controller';
import PlayerRoute from './routes/player-route';

import { swaggerSpec, swaggerUi, swaggerUiOptions } from './docs/swagger';
import { swaggerMiddleware } from './middlewares/swagger-middleware';

import HealthController from './controllers/health-controller';
import HealthRoute from './routes/health-route';

// Loads environment variables from the .env file
dotenv.config();

// Creates instances of the database, service, controller, and routes
const playerDatabase = new PlayerDatabase();
const playerService = new PlayerService(playerDatabase);
const playerController = new PlayerController(playerService);
const playerRoute = new PlayerRoute(playerController);

const healthController = new HealthController();
const healthRoute = new HealthRoute(healthController);

// Creates the Express app
const app = express();

/* -----------------------------------------------------------------------------
 * Middlewares
 * -------------------------------------------------------------------------- */

// Helmet - https://helmetjs.github.io/
app.use(helmet());

// CORS - https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());

// Body-parser - https://expressjs.com/en/resources/middleware/body-parser.html
app.use(bodyParser.json());

// Swagger UI Express - https://github.com/scottie1984/swagger-ui-express
app.use('/swagger', swaggerMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/swagger/index.html', (_, response) => {
    response.redirect(301, '/swagger');
});
app.get('/swagger.json', (_, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(swaggerSpec);
});

// express.Router - https://expressjs.com/en/guide/routing.html
app.use('/', playerRoute.router);
app.use('/', healthRoute.router);

export default app;
