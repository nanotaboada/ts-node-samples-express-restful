/* -----------------------------------------------------------------------------
 * Application
 * -------------------------------------------------------------------------- */

import express, { Request, Response, NextFunction } from 'express';

import helmet from 'helmet';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import playerRoute from './routes/player-route';
import logger from './utils/logger';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';

dotenv.config();

const app = express();

/* -----------------------------------------------------------------------------
 * Middlewares
 * -------------------------------------------------------------------------- */

// Helmet
// https://github.com/helmetjs/helmet
app.use(helmet());
// CORS
// https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());
// body-parser
// https://expressjs.com/en/resources/middleware/body-parser.html
app.use(bodyParser.json());
// Sample custom middleware to log incoming requests
app.use((request: Request, response: Response, next: NextFunction) => {
    logger.debug(`[request] URI: ${request.method} ${request.url}`);
    next(); // Call the next middleware in the stack
});
// Swagger UI Express
// https://github.com/scottie1984/swagger-ui-express
app.use(
    '/swagger',
    (request: Request, response: Response, next: NextFunction) => {
        // https://github.com/scottie1984/swagger-ui-express/issues/346
        response.setHeader('Content-Security-Policy', `script-src 'self'`);
        next();
    },
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec),
);
// Routing
// https://expressjs.com/en/guide/routing.html
app.use('/', playerRoute);

export default app;
