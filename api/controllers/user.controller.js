import UserService from "../services/user.service.js";
import responseHandler from "../utils/responseHandler.js";

/**
 * Create user
 * @param {Object} req 
 * @param {Object} res 
 */
export const createUser = async (req, res) => {
    const { body } = req;
    await UserService.createUser(body).catch((e) => {
        responseHandler(res, null, 400)
    })
    responseHandler(res, null, 201);
}

/**
 * Get user info
 * @param {Object} req 
 * @param {Object} res 
 */
export const getUserInfo = async (req, res) => {
    const { params: { userId } } = req;
    const user = await UserService.getUserInfo(userId);
    responseHandler(res, user);
}

export const updateUser = async (req, res) => {
    const { params: { userId }, body } = req;
    const user = await UserService.updateUser(userId, body);
    responseHandler(res, null, 204);
}
