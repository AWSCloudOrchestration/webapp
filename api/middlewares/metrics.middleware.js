import { statsDClient } from '../../statsd/index.js';

/**
 * API calls counter
 * @param {String} method
 * @param {String} url
 */
const countAllApiCalls = (method, url) => {
  const statsPrefix = process.env.STATSD_PREFIX;
  let metricName = `_${method.toLowerCase()}_${url}_count`;
  if (!statsPrefix) metricName = metricName.slice(1);
  const generalizedName = metricName.replace(/\/\d+/g, '{id}');
  statsDClient.increment(generalizedName);
};

const metricsMiddleware = (req, res, next) => {
  const { method, url } = req;
  countAllApiCalls(method, url);
  next();
};

export default metricsMiddleware;
