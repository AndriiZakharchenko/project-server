import winston from 'winston';

export const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.Console({
      level: 'info',
    }),
    new winston.transports.File({ filename: 'src/logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'src/logs/info.log', level: 'info' }),
  ],
  silent: process.env.NODE_ENV === 'production',
});

export const loggerRequests = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'ddd, DD MMM YYYY HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `[${timestamp}] ${level.toUpperCase()} ${message}`),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'src/logs/requests.log', level: 'info' }),
  ],
  silent: process.env.NODE_ENV === 'production',
});
