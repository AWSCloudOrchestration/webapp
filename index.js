import app from './api/app.js';
import { initSqlConn, closeSqlConn } from './db/sql/index.js';
import { initStatsDClient, closeStatsDClient } from './statsd/index.js';
import logger from './logger/index.js';
import centralErrorHandler from './api/utils/centralErrorHandler.js';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const port = process.env.APP_PORT || 3000;

const server = app.listen(port, async () => {
  await initSqlConn();
  initStatsDClient();
  logger.info(`Server listening on port ${port}`);
});

const gracefulShutdown = () => {
  if (server) {
    server.close(async (err) => {
      if (err) {
        logger.error('Shutting down with error: ', { error: err.stack });
        process.exitCode = 1;
      }
      await closeSqlConn();
      closeStatsDClient();
      process.exit();
    });
  }
};

process.on('uncaughtException', (error) => {
  centralErrorHandler(error);
});

process.on('unhandledRejection', (reason) => {
  centralErrorHandler(reason);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, gracefully shutting down.');
  gracefulShutdown();
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received, gracefully shutting down.');
  gracefulShutdown();
});

