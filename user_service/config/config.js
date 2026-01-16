require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://app:app@localhost:5432/app_users',
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: process.env.DATABASE_URL || 'postgres://app:app@localhost:5432/app_users_test',
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  }
};
