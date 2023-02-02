import { executeQuery } from '../../db/sql/executor.js';
import { createHash, checkHash } from '../utils/hashUtil.js';
import _ from 'lodash';
import { validateEmail } from '../utils/stringUtils.js';

const checkForExistingUser = async (username) => {
    const query = `SELECT * FROM users WHERE username="${username}"`;
    const user = await executeQuery(query);
    return user;
}

/**
 * Validate request data
 * @param {Object} payload 
 * @returns {Object}
 */
const validateRequestData = (payload, validList) => {
    const validKeys = _.pick(payload, validList);
    _.forEach(validKeys, (value, key) => {
        if (typeof value !== 'string') throw new Error('Malformed data');
        if (key === 'username') {
            if (!validateEmail(value)) throw new Error('Username malformed');
        }
    })
    return validKeys;
}

/**
 * Create new user
 * @param {Object} userPayload 
 * @returns 
 */
const createUser = async (userPayload) => {
    const validList = ['first_name', 'last_name', 'password', 'username'];
    const { first_name, last_name, username, password } = validateRequestData(userPayload, validList);
    const existingUser = await checkForExistingUser(username);
    if (existingUser.length > 0) throw new Error('User already exists');
    const hashedPass = await createHash(password);
    const query = `INSERT INTO users (first_name, last_name, username, password) VALUES ("${first_name}", "${last_name}", "${username}", "${hashedPass}")`;
    // Create new user
    await executeQuery(query);
    const user = await executeQuery(`SELECT id, first_name, last_name, username, account_created, account_updated FROM users WHERE username="${username}"`);
    return user[0];
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
    const validList = ['first_name', 'last_name', 'password'];
    const validUpdateKeys = validateRequestData(payload, validList);
    // Set query builder
    _.forEach(validUpdateKeys, async (value, key) => {
        if (_.isEmpty(value)) return;
        if (key === 'password') {
            const pass = await createHash(value);
            setQuery += ` ${key}="${pass}",`;
        } else setQuery += ` ${key}="${value}",`;
    });

    // slice to remove comma at the end
    const query = `UPDATE users ` + setQuery.slice(0, -1) + ` WHERE id=${id}`;
    return executeQuery(query);
}

export default {
    createUser,
    getUserInfo,
    checkPassword,
    updateUser
}