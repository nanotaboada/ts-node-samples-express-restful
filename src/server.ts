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
    logger.info(`🚀 Running at http://localhost:${port}`);
});
// Handles the Server shutdown on SIGINT (e.g., Ctrl+C)
process.on('SIGINT', () => {
    logger.info('🛑 Shutting down...');
    server.close(() => {
        logger.info('👋 Exited cleanly.');
        process.exit(0);
    });
});
