import app from './app.js';
import http from 'node:http';
import dotenv from 'dotenv';
import logger from './utils/logger.js';

// Loads environment variables from the .env file
dotenv.config();
// Gets the port from the environment variable, or defaults to 9000
const port = process.env.PORT ?? 9000;
// Creates a Server using the Express app
const server = http.createServer(app);
// Starts the Server and listens on the specified port
server.listen(port, () => {
    logger.info({ port, action: 'serverStart' }, 'Server started');
});
// Handles the Server shutdown on SIGINT (e.g., Ctrl+C)
process.on('SIGINT', () => {
    logger.info({ signal: 'SIGINT', action: 'serverShutdown' }, 'Shutting down server');
    server.close(() => {
        logger.info({ action: 'serverExit' }, 'Server exited cleanly');
        process.exit(0);
    });
});
