import { Sequelize } from 'sequelize';
import { userModel } from '../../api/models/user.model.js';
import { productModel } from '../../api/models/product.model.js';

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

  const sequelize = new Sequelize(database, username, password, {
    host,
    dialect: 'mysql',
  });
  return sequelize;
};

const loadModels = async () => {
  connection.users = userModel(connection);
  connection.products = productModel(connection);
};

/**
 * Initialize connection
 */
const initConnection = async () => {
  try {
    connection = await createConnection();
    await loadModels();
    await connection.authenticate();
    console.log('MySQL connected.');
  } catch (err) {
    console.error('MySQL connect failed: ', err);
  }
};

export {
  initConnection as initSqlConn,
  connection,
};
