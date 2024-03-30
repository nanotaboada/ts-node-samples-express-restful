import winston from 'winston';

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'debug', // Set the default log level
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.colorize(),
      stderrLevels: ['error'] // Send error-level logs to stderr
    })
  ]
});

export default logger;
