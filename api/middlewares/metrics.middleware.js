import { statsDClient } from '../../statsd/index.js';

const countAllApiCalls = (method, url) => {
  const metricName = `.${method.toLowerCase()}.${url}.count`;
  statsDClient.increment(metricName);
};

const metricsMiddleware = (req, res, next) => {
  const { method, url } = req;
  countAllApiCalls(method, url);
  next();
};

export default metricsMiddleware;
