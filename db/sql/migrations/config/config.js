import 'dotenv/config';

export default {
  'development': {
    'username': process.env.DEV_SQL_USER,
    'password': process.env.DEV_SQL_PASS,
    'database': process.env.DEV_SQL_DB,
    'host': process.env.DEV_SQL_HOST,
    'dialect': 'mysql',
  },
  'production': {
    'username': process.env.PROD_SQL_USER,
    'password': process.env.PROD_SQL_PASS,
    'database': process.env.PROD_SQL_DB,
    'host': process.env.PROD_SQL_HOST,
    'dialect': 'mysql',
  },
};
