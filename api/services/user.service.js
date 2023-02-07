import { createHash } from '../utils/hashUtil.js';
import _ from 'lodash';
import AppError from '../utils/AppError.js';
import getModelInstance from '../../db/sql/getModelInstance.js';


const checkForExistingUser = async (username) => {
  const UserModel = getModelInstance('users');
  const user = await UserModel.findAll({ where: { username } });
  return user;
};

/**
 * Create new user
 * @param {Object} userPayload
 * @returns
 */
const createUser = async (userPayload) => {
  const UserModel = getModelInstance('users');
  const { first_name, last_name, username, password } = userPayload;
  const existingUser = await checkForExistingUser(username);
  if (existingUser.length > 0) throw new AppError('User already exists', 400);
  const hashedPass = await createHash(password);
  const user = await UserModel.create({ first_name, last_name, username, password: hashedPass });
  return user;
};

/**
 * Get user info by id
 * @param {String} id
 * @returns {Object}
 */
const getUserInfo = async (id) => {
  const UserModel = getModelInstance('users');
  const user = await UserModel.findAll({ where: { id } });
  return _.get(user[0], 'dataValues');
};


/**
 * Update user info
 * @param {String} id
 * @param {Object} payload
 * @returns
 */
const updateUser = async (id, payload) => {
  const UserModel = getModelInstance('users');
  const updateObject = _.cloneDeep(payload);
  // Update pass
  updateObject.password = await createHash(updateObject.password);
  const { first_name, last_name, password } = updateObject;
  return UserModel.update({ first_name, last_name, password }, { where: { id } });
};

export default {
  createUser,
  getUserInfo,
  updateUser,
};
