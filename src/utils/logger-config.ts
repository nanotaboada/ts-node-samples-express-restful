import pino from 'pino';
import type { LoggerOptions } from 'pino';

const isDevelopment = process.env.NODE_ENV !== 'production';
const isTest = process.env.NODE_ENV === 'test';

// Determine log level based on environment
const getLogLevel = (): string => {
    if (process.env.LOG_LEVEL) {
        return process.env.LOG_LEVEL;
    }
    if (isTest) {
        return 'silent';
    }
    if (isDevelopment) {
        return 'debug';
    }
    return 'info';
};

// Configure transport based on environment
const getTransport = (): LoggerOptions['transport'] => {
    if (isTest) {
        return undefined;
    }
    if (isDevelopment) {
        return {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                ignore: 'pid,hostname',
                singleLine: false,
                levelFirst: true,
            },
        };
    }
    return undefined;
};

export const loggerConfig: LoggerOptions = {
    level: getLogLevel(),

    base: {
        env: process.env.NODE_ENV || 'development',
        app: 'ts-node-samples-express-restful',
        version: '1.0.0',
    },

    redact: {
        paths: [
            'password',
            'token',
            'authorization',
            'req.headers.authorization',
            'req.headers.cookie',
        ],
        censor: '[REDACTED]',
    },

    serializers: {
        req: pino.stdSerializers.req,
        res: pino.stdSerializers.res,
        err: pino.stdSerializers.err,
    },

    timestamp: pino.stdTimeFunctions.isoTime,

    transport: getTransport(),
};
