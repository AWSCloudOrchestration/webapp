/**
 *  Response Handler
 * @param {Object} res
 * @param {Object} data
 * @param {Number} responseCode
 */
 const responseHandler = (res, data, responseCode = 200) => {
    res.status(responseCode).send(data);
  };
  
  export default responseHandler;
  