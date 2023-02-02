import UserService from "../services/user.service.js";
import responseHandler from "../utils/responseHandler.js";

/**
 * Create user
 * @param {Object} req 
 * @param {Object} res 
 */
export const createUser = async (req, res) => {
    try {
        const { body } = req;
        await UserService.createUser(body);
        responseHandler(res, null, 201);
    } catch (err) {
        console.error(err.message);
        responseHandler(res, null, 400);
    }
}

/**
 * Get user info
 * @param {Object} req 
 * @param {Object} res 
 */
export const getUserInfo = async (req, res) => {
    try {
        const { params: { userId } } = req;
        const user = await UserService.getUserInfo(userId);
        responseHandler(res, user);
    } catch (err) {
        responseHandler(res, null, 400);
    }
}

export const updateUser = async (req, res) => {
    const { params: { userId }, body } = req;
    const user = await UserService.updateUser(userId, body);
    responseHandler(res, null, 204);
}
