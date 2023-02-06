/**
 * Error handler
 * All errors propagated from lower levels handled here centrally
 * Controllers -> Error Middleware -> Central Error Handler
 * https://github.com/goldbergyoni/nodebestpractices/blob/master/sections/errorhandling/centralizedhandling.md
 * @param {Object} error
 * @param {Object} res
 */
const centralErrorHandler = (error, res) => {
  // Log to file
  console.error('CentralErrorHandler: ', error);
  res.sendStatus(500);
};

export default centralErrorHandler;

