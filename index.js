import app from './api/app.js';
import { initSqlConn } from './db/sql/index.js';
import { initStatsDClient } from './statsd/index.js';
import logger from './logger/index.js';
import * as dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

const port = process.env.APP_PORT || 3000;

app.listen(port, async () => {
  await initSqlConn();
  initStatsDClient();
  console.log('Server listening on port', port);
  logger.info(`Server listening on port ${port}`);
});
