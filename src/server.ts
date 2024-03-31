/* -----------------------------------------------------------------------------
 * Server
 * -------------------------------------------------------------------------- */

import app from './app';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? 9000;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
