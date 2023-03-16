import 'dotenv/config';

export default {
  'development': {
    'username': process.env.SQL_USER,
    'password': process.env.SQL_PASS,
    'database': process.env.SQL_DB,
    'host': process.env.SQL_HOST,
    'dialect': 'mysql',
  },
  'production': {
    'username': process.env.SQL_USER,
    'password': process.env.SQL_PASS,
    'database': process.env.SQL_DB,
    'host': process.env.SQL_HOST,
    'dialect': 'mysql',
  },
};
