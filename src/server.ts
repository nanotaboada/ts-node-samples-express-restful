/* -----------------------------------------------------------------------------
 * Server
 * -------------------------------------------------------------------------- */

import app from './app';
import http from 'http';
import dotenv from 'dotenv';

// Loads environment variables from the .env file
dotenv.config();
// Gets the port from the environment variable, or defaults to 9000
const port = process.env.PORT ?? 9000;
// Creates a Server using the Express app
const server = http.createServer(app);
// Starts the Server and listens on the specified port
server.listen(port, () => {
    console.log(`[server] 🚀 Running at http://localhost:${port}`);
});
// Handles the Server shutdown on SIGINT (e.g., Ctrl+C)
process.on('SIGINT', () => {
    console.log('[server] 🛑 Shutting down...');
    server.close(() => {
        console.log('[server] 👋 Exited cleanly.');
        process.exit(0);
    });
});
