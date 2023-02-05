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
    if (existingUser.length > 0) throw new Error('User already exists');
    const hashedPass = await createHash(password);
    const query = `INSERT INTO users (first_name, last_name, username, password) VALUES ("${first_name}", "${last_name}", "${username}", "${hashedPass}")`;
    // Create new user
    await executeQuery(query);
    const user = await executeQuery(`SELECT id, first_name, last_name, username, account_created, account_updated FROM users WHERE username="${username}"`);
    return user[0];
}

/**
 * Get user info by id
 * @param {String} id 
 * @returns {Object}
 */
const getUserInfo = async (id) => {
    const columns = `id, first_name, last_name, username, account_created, account_updated`;
    const query = `SELECT ${columns} FROM users WHERE id=${id}`;
    const user = await executeQuery(query);
    return user[0];
}

/**
 * Check if password matches
 * @param {String} username 
 * @param {String} password 
 * @param {String} id 
 * @returns {Boolean}
 */
const checkPassword = async (username, password, id) => {
    const query = `SELECT * FROM users WHERE username="${username}" AND id=${id}`;
    const user = await executeQuery(query);
    if (user.length === 0) return false;
    return checkHash(password, _.get(user[0], 'password'));
}

/**
 * Update user info
 * @param {String} id 
 * @param {Object} payload 
 * @returns 
 */
const updateUser = async (id, payload) => {
    const updateObject = _.cloneDeep(payload);
    let setQuery = 'SET';
    // Update pass
    if (_.get(updateObject, 'password')) {
        setQuery += ` password="${await createHash(updateObject.password)}",`;
        delete updateObject.password; // Should not be added in the query again
    }
    // Set query builder
    _.forEach(updateObject, async (value, key) => {
        if (_.isEmpty(value)) return;
        setQuery += ` ${key}="${value}",`;
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