import { StatsD } from 'node-statsd';
import logger from '../logger/index.js';

let statsDClient = null;

/**
 * Initialize statsd client
 */
const initStatsDClient = () => {
  try {
    if (!statsDClient) {
      const options = {
        host: process.env.STATSD_HOST,
        port: process.env.STATSD_PORT,
        prefix: process.env.STATSD_PREFIX,
        cacheDns: process.env.STATSD_CACHE_DNS,
      };
      statsDClient = new StatsD(options);
    }
  } catch (err) {
    logger.error('StatsD error: ', { error: err.stack });
  }
};

/**
 * Close connection
 */
const closeStatsDClient = () => {
  statsDClient.close();
};

export {
  initStatsDClient,
  closeStatsDClient,
  statsDClient,
};


