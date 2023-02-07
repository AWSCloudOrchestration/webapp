import _ from 'lodash';
import base64Util from '../utils/base64.js';
import authUtil from '../utils/authUtil.js';
import AppError from '../utils/AppError.js';
import getModelInstance from '../../db/sql/getModelInstance.js';
import { checkHash } from '../utils/hashUtil.js';

const getUserFromDB = async (username) => {
  const UserModel = getModelInstance('users');
  const user = await UserModel.findOne({ attributes: ['username', 'password', 'id'], where: { username } });
  return user;
};

/**
 * Check if password matches
 * @param {String} username
 * @param {String} password
 * @param {String} id
 * @returns {Boolean}
 */
const checkPassword = async (password, userData) => {
  if (_.isEmpty(_.get(userData, 'dataValues'))) return false;
  return checkHash(password, _.get(userData, 'dataValues.password'));
};

/**
 * Basic Auth Middleware
 * Header expected:
 * Authorization: Basic <username:password>
 */
const authMiddleware = () => async (req, res, next) => {
  const authHeader = _.get(req, 'headers.authorization');
  if (_.isEmpty(authHeader)) return next(new AppError('Unauthorized. Please pass basic auth.', 401));
  const basicAuth = authUtil.extractAsBasicAuth(authHeader);
  const [username, password] = base64Util.decode(basicAuth).split(':');
  const userData = await getUserFromDB(username);
  const passwordMatch = await checkPassword(password, userData);
  if (passwordMatch) {
    req.user = _.get(userData, 'dataValues');
    return next();
  }
  // Unauthorized
  return next(new AppError('Unauthorized', 401));
};

export default authMiddleware;
