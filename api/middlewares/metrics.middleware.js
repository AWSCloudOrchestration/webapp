import { statsDClient } from '../../statsd/index.js';

/**
 * API calls counter
 * @param {String} method
 * @param {String} url
 */
const countAllApiCalls = (method, url) => {
  const metricName = `${method.toLowerCase()}_${url}_count`;
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
