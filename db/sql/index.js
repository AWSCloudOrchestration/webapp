import { Sequelize } from 'sequelize';
import { userModel } from '../../api/models/user.model.js';
import { productModel } from '../../api/models/product.model.js';
import { imageModel } from '../../api/models/image.model.js';
import logger from '../../logger/index.js';

let connection;

/**
 * Create sql connection
 * @returns {connection}
 */
const createConnection = async () => {
  const database = process.env.SQL_DB;
  const username = process.env.SQL_USER;
  const password = process.env.SQL_PASS;
  const host = process.env.SQL_HOST;
  const maxPoolConnections = process.env.SQL_MAX_POOL_CONN;
  const maxRetries = process.env.SQL_CONN_MAX_RETRIES;

  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
    pool: {
      max: +maxPoolConnections,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    retry: {
      max: +maxRetries,
      timeout: 10000,
      match: [
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
      ],
      name: 'SQLConnector',
    },
  });
  return sequelize;
};

const loadModels = async () => {
  connection.users = userModel(connection);
  connection.products = productModel(connection);
  connection.images = imageModel(connection);
};

/**
 * Initialize connection
 */
const initConnection = async () => {
  try {
    connection = await createConnection();
    await loadModels();
    await connection.authenticate();
    await connection.sync();
    console.log('MySQL connected.');
    logger.info('MySQL connected.');
  } catch (err) {
    console.error('SQLConnector error: ', err.message);
    logger.error('SQLConnector error: ', { error: err.stack });
  }
};

export {
  initConnection as initSqlConn,
  connection,
};
