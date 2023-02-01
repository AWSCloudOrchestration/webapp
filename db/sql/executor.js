import { connection } from './index.js';

/**
 * Execute SQL query
 * @param {String} query 
 * @param {Array} data 
 * @returns 
 */
const executeQuery = async (query, data = null) => {
    try {
        if (!connection) return;
        const [rows] = await connection.execute(query, data);
        return rows;
    } catch {
        console.error('Query execution failed.');
    }
}

export {
    executeQuery,
}