import _ from 'lodash';
import base64Util from '../utils/base64.js';
import authUtil from '../utils/authUtil.js';
import AppError from '../utils/AppError.js';
import getModelInstance from '../../db/sql/getModelInstance.js';
import { checkHash } from '../utils/hashUtil.js';

/**
 * Check if password matches
 * @param {String} username
 * @param {String} password
 * @param {String} id
 * @returns {Boolean}
 */
const checkPassword = async (username, password, id, next) => {
  const UserModel = getModelInstance('users');
  const user = await UserModel.findAll({ attributes: ['username', 'password', 'id'], where: { username } });
  if (_.isEmpty(_.get(user[0], 'dataValues'))) return false;
  if (_.get(user[0], 'dataValues.id') != id) return 403;
  return checkHash(password, _.get(user[0], 'dataValues.password'));
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
  const id = _.get(req, 'params.userId');
  const [username, password] = base64Util.decode(basicAuth).split(':');
  const passwordMatch = await checkPassword(username, password, id, next);
  if (passwordMatch === 403) return next(new AppError('Forbidden resource', 403));
  if (passwordMatch) return next();
  // Unauthorized
  return next(new AppError('Unauthorized', 401));
};

export default authMiddleware;
