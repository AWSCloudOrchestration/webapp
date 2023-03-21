import logger from '../../logger/index.js';

/**
 *  Response Handler
 * @param {Object} req
 * @param {Object} res
 * @param {Object} data
 * @param {Number} responseCode
 */
const responseHandler = (req, res, data, responseCode = 200) => {
  res.status(responseCode).send(data);
  logger.logRequest(req, responseCode);
};

export default responseHandler;
