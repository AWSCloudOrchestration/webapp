import _ from 'lodash';
import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
};

const getLevels = () => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return _.pick(logLevels, ['error', 'warn', 'info']);
  } else if (env === 'development') {
    return logLevels;
  }
};

const formatConsole = format.printf(({ level, message, timestamp, ...metadata }) => {
  let meta = '';
  if (_.keys(metadata).length > 0) {
    meta = JSON.stringify(metadata);
  }
  return `[${level}] [${timestamp}] ${message} ${meta}`;
});

const logger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json(),
  ),
  levels: getLevels(),
  exitOnError: false,
  transports: [
    // App logs
    new transports.DailyRotateFile({
      filename: 'webapp-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      utc: true,
      dirname: process.env.APP_LOGS_DIRNAME || '/tmp/webapp',
    }),
    // Error logs
    new transports.DailyRotateFile({
      level: 'error',
      filename: 'errors-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      utc: true,
      dirname: process.env.APP_ERROR_LOGS_DIRNAME || '/tmp/webapp',
    }),
    new transports.Console({
      format: process.env.NODE_ENV !== 'production' ? format.combine(
          format.colorize(),
          formatConsole,
      ): format.combine(
          formatConsole,
      ),
    })],
});

const removeSensitiveData = (body) => {
  const sensitiveKeys = ['password'];
  return _.omit(body, sensitiveKeys);
};

const logRequest = (req, statusCode, error) => {
  let level = 'info';
  const { body, method, originalUrl } = req;
  const logData = {
    method,
    url: originalUrl,
    body: removeSensitiveData(body),
    statusCode,
  };
  if (statusCode >= 400 && statusCode < 600) {
    level = 'error';
    logData.error = error;
  }
  logger[level](`${method} ${originalUrl}`, logData);
};

logger.logRequest = logRequest;

export default logger;
