/* -----------------------------------------------------------------------------
 * Application
 * -------------------------------------------------------------------------- */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import PlayerDatabase from './data/player-database';
import PlayerService from './services/player-service';
import PlayerController from './controllers/player-controller';
import PlayerRoute from './routes/player-route';

import { swaggerMiddleware, swaggerUi, swaggerSpec } from './middlewares/swagger-middleware';

// Loads environment variables from the .env file
dotenv.config();
// Creates instances of the database, service, controller, and routes
const playerDatabase = new PlayerDatabase();
const playerService = new PlayerService(playerDatabase);
const playerController = new PlayerController(playerService);
const playerRoute = new PlayerRoute(playerController);
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
app.use('/swagger', swaggerMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// express.Router - https://expressjs.com/en/guide/routing.html
app.use('/', playerRoute.router);

export default app;
