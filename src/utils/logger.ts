import winston from 'winston';
import fs from 'fs-extra';

const logLevels = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'cyan',
};

fs.ensureDirSync('logs');

const logger = winston.createLogger({
    levels: winston.config.npm.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'info',
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: winston.format.simple(),
        }),
        new winston.transports.File({
            filename: 'logs/app.log',
            level: 'warn',
            format: winston.format.simple(),
        }),
    ],
});

export default logger;
