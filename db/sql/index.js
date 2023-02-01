import mysql from 'mysql2/promise';

let connection;

/**
 * Create sql connection
 * @returns {connection}
 */
const createConnection = async () => {
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'mysql',
        password: 'password',
        database: 'webapp'
    });
    return connection;
}

/**
 * Initialize connection
 */
const initConnection = async () => {
    try {
        connection = await createConnection();
        await connection.connect();
        console.log('MySQL connected.')
    } catch (err) {
        console.error("MySQL connect failed.")
    }
}

export {
    initConnection as initSqlConn,
    connection,
}