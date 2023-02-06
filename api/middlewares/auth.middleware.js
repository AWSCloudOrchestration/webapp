import _ from 'lodash';
import UserService from '../services/user.service.js';
// import responseHandler from '../utils/responseHandler.js';
import base64Util from '../utils/base64.js';
import authUtil from '../utils/authUtil.js';
import AppError from '../utils/AppError.js';

/**
 * Basic Auth Middleware
 * Header expected:
 * Authorization: Basic <username:password>
 */
const authMiddleware = () => async (req, res, next) => {
  const authHeader = _.get(req, 'headers.authorization');
  if (_.isEmpty(authHeader)) return next(new AppError('Unauthorized. Please pass basic auth.', 401));
  const basicAuth = authUtil.extractAsBasicAuth(authHeader);
  const id = _.get(req, 'params.userId');
  const [username, password] = base64Util.decode(basicAuth).split(':');
  const passwordMatch = await UserService.checkPassword(username, password, id);
  if (passwordMatch) return next();
  // Unauthorized
  return next(new AppError('Forbidden resource', 403));
};

export default authMiddleware;
