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
  const generalizedName = metricName.replace(/\/\d+/g, '/{id}');
  if (!statsDClient) return;
  statsDClient.increment(generalizedName);
};

const metricsMiddleware = (req, res, next) => {
  const { method, originalUrl } = req;
  countAllApiCalls(method, originalUrl);
  next();
};

export default metricsMiddleware;
