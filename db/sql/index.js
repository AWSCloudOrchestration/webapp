import { Sequelize } from 'sequelize';
import { userModel } from '../../api/models/user.model.js';
import { productModel } from '../../api/models/product.model.js';
import { imageModel } from '../../api/models/image.model.js';

let connection;

/**
 * Create sql connection
 * @returns {connection}
 */
const createConnection = async () => {
  const envPrefix = process.env.NODE_ENV === 'production' ? 'PROD' : 'DEV';
  const database = process.env[`${envPrefix}_SQL_DB`];
  const username = process.env[`${envPrefix}_SQL_USER`];
  const password = process.env[`${envPrefix}_SQL_PASS`];
  const host = process.env[`${envPrefix}_SQL_HOST`];

  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
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
  } catch (err) {
    console.error('MySQL connect failed: ', err);
  }
};

export {
  initConnection as initSqlConn,
  connection,
};
