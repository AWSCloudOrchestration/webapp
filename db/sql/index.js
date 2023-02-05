import mysql from 'mysql2/promise';

let connection;

/**
 * Create sql connection
 * @returns {connection}
 */
const createConnection = async () => {
    connection = await mysql.createConnection({
        host: process.env.SQL_HOST,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASS,
        database: process.env.SQL_DB,
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