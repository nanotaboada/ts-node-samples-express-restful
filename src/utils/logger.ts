import pino from 'pino';
import { loggerConfig } from './logger-config.js';

const logger = pino(loggerConfig);

export default logger;
