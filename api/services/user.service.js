import { executeQuery } from '../../db/sql/executor.js';
import createHash from '../utils/createHash.js';

/**
 * Create new user
 * @param {Object} userPayload 
 * @returns 
 */
const createUser = async (userPayload) => {
    const { first_name, last_name, username, password } = userPayload;
    const hashedPass = await createHash(password);
    const query = `INSERT INTO users (first_name, last_name, username, password) VALUES ("${first_name}", "${last_name}", "${username}", "${hashedPass}")`;
    // Create new user
    const user = await executeQuery(query);
    return user;
}

const getUserInfo = async (id) => {
    const query = `SELECT * FROM users WHERE id=${id}`;
    const user = await executeQuery(query);
    return user;
}

export default {
    createUser,
    getUserInfo
}