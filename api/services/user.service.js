import { executeQuery } from '../../db/sql/executor.js';
import { createHash, checkHash } from '../utils/hashUtil.js';
import _ from 'lodash';

const checkForExistingUser = async (username) => {
    const query = `SELECT * FROM users WHERE username="${username}"`;
    const user = await executeQuery(query);
    return user;
}

/**
 * Create new user
 * @param {Object} userPayload 
 * @returns 
 */
const createUser = async (userPayload) => {
    const { first_name, last_name, username, password } = userPayload;
    const existingUser = await checkForExistingUser(username);
    if (existingUser) throw new Error('User already exists');
    const hashedPass = await createHash(password);
    const query = `INSERT INTO users (first_name, last_name, username, password) VALUES ("${first_name}", "${last_name}", "${username}", "${hashedPass}")`;
    // Create new user
    const user = await executeQuery(query);
    delete user.password;
    return user;
}

const getUserInfo = async (id) => {
    const columns = `id, first_name, last_name, username, account_created, account_updated`;
    const query = `SELECT ${columns} FROM users WHERE id=${id}`;
    const user = await executeQuery(query);
    return user[0];
}

const checkPassword = async (username, password, id) => {
    const query = `SELECT * FROM users WHERE username="${username}" AND id=${id}`;
    const user = await executeQuery(query);
    if (user.length === 0) return false;
    return checkHash(password, _.get(user[0], 'password'));
}

const updateUser = async (id, payload) => {
    let setQuery = 'SET';
    const validUpdateKeys = _.pick(payload, ['first_name', 'last_name', 'password']);
    // Set query builder
    _.forEach(validUpdateKeys, async (value, key) => {
        if (_.isEmpty(value)) return;
        if (key === 'password') {
            value = await createHash(value);
        }
        setQuery += ` ${key}="${value}",`;
    });
    // Update account timestamp
    const updatedTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
    setQuery += ` account_updated="${updatedTime}"`;
    // slice to remove comma at the end
    const query = `UPDATE users ` + setQuery + ` WHERE id=${id}`;
    return executeQuery(query);
}

export default {
    createUser,
    getUserInfo,
    checkPassword,
    updateUser
}