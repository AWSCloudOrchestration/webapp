import { StatsD } from 'node-statsd';

let statsDClient = {};

/**
 * Initialize statsd client
 */
const initStatsDClient = () => {
  try {
    const options = {
      host: process.env.STATSD_HOST,
      port: process.env.STATSD_PORT,
      prefix: process.env.STATSD_PREFIX,
      cacheDns: process.env.STATSD_CACHE_DNS,
    };
    statsDClient = new StatsD(options);
  } catch (err) {
    console.error('StatsD error: ', err);
  }
};

export {
  initStatsDClient,
  statsDClient,
};


