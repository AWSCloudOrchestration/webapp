import { executeQuery } from '../../db/sql/executor.js';
import { createHash, checkHash } from '../utils/hashUtil.js';
import _ from 'lodash';
     
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

const checkPassword = async (username, password) => {
    const query = `SELECT * FROM users WHERE username="${username}"`;
    const user = await executeQuery(query);
    return checkHash(password, _.get(user[0], 'password'));
}

export default {
    createUser,
    getUserInfo,
    checkPassword
}