require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/blog',
    dialect: 'postgres',
    logging: false
  },
  test: {
    url: process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/blog_test',
    dialect: 'postgres',
    logging: false
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false
  }
};
