import UserService from '../services/user.service.js';
import responseHandler from '../utils/responseHandler.js';
import catchAsync from '../utils/catchAsync.js';

/**
 * Create user
 * @param {Object} req
 * @param {Object} res
 */
export const createUser = catchAsync(async (req, res) => {
  const { body } = req;
  const user = await UserService.createUser(body);
  responseHandler(res, user, 201);
});

/**
 * Get user info
 * @param {Object} req
 * @param {Object} res
 */
export const getUserInfo = catchAsync(async (req, res) => {
  const { params: { userId }, user } = req;
  const userInfo = await UserService.getUserInfo(userId, user);
  responseHandler(res, userInfo);
});

export const updateUser = catchAsync(async (req, res) => {
  const { params: { userId }, body, user } = req;
  await UserService.updateUser(userId, body, user);
  responseHandler(res, null, 204);
});
