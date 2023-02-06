import _ from 'lodash';
import UserService from '../services/user.service.js';
import responseHandler from '../utils/responseHandler.js';
import base64Util from '../utils/base64.js';
import authUtil from '../utils/authUtil.js';

/**
 * Basic Auth Middleware
 * Header expected:
 * Authorization: Basic <username:password>
 */
const authMiddleware = () => async (req, res, next) => {
  const basicAuth = authUtil.extractAsBasicAuth(_.get(req, 'headers.authorization'));
  const id = _.get(req, 'params.userId');
  if (_.isEmpty(basicAuth)) return responseHandler(res, 'Unauthorized', 401);
  const [username, password] = base64Util.decode(basicAuth).split(':');
  const passwordMatch = await UserService.checkPassword(username, password, id);
  if (passwordMatch) return next();
  // Unauthorized
  responseHandler(res, 'Unauthorized', 401);
};

export default authMiddleware;
