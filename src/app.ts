import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import PlayerDatabase from './database/player-database.js';
import PlayerService from './services/player-service.js';
import PlayerController from './controllers/player-controller.js';
import PlayerValidator from './middlewares/player-validator.js';
import PlayerRoute from './routes/player-route.js';

import { swaggerSpec, swaggerUi, swaggerUiOptions } from './docs/swagger.js';
import { swaggerMiddleware } from './middlewares/swagger-middleware.js';

import RateLimiter from './middlewares/rate-limiter.js';

import HealthController from './controllers/health-controller.js';
import HealthRoute from './routes/health-route.js';

// Loads environment variables from the .env file
dotenv.config();

// Creates instances of the database, service, controller, validator, and routes
const playerDatabase = new PlayerDatabase();
const playerService = new PlayerService(playerDatabase);
const playerController = new PlayerController(playerService);
const playerValidator = new PlayerValidator();
const playerRoute = new PlayerRoute(playerController, playerValidator);

const healthController = new HealthController();
const healthRoute = new HealthRoute(healthController);

const rateLimiter = new RateLimiter();

// Creates the Express app
const app = express();

// Helmet - https://helmetjs.github.io/
app.use(helmet());

// CORS - https://expressjs.com/en/resources/middleware/cors.html
// https://rules.sonarsource.com/typescript/RSPEC-5122/
app.use(cors()); //NOSONAR

// Body-parser - https://expressjs.com/en/resources/middleware/body-parser.html
app.use(bodyParser.json());

// Rate Limiter - https://www.npmjs.com/package/express-rate-limit
app.use(rateLimiter.generalLimiter);

// Swagger UI Express - https://github.com/scottie1984/swagger-ui-express
app.use('/swagger', swaggerMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
app.get('/swagger/index.html', (_, response) => {
    response.redirect(301, '/swagger');
});
app.get('/swagger.json', (_, response) => {
    response.setHeader('Content-Type', 'application/json');
    response.send(swaggerSpec);
});

// Strict rate limiter for write operations
app.use('/players', (request, response, next) => {
    if (['POST', 'PUT', 'DELETE'].includes(request.method)) {
        return rateLimiter.strictLimiter(request, response, next);
    }
    next();
});

// express.Router - https://expressjs.com/en/guide/routing.html
app.use('/', playerRoute.router);
app.use('/', healthRoute.router);

export default app;
