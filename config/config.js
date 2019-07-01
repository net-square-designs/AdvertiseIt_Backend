require('babel-register');
const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    use_env_variable: 'DATABASE_DEVELOPMENT',
    dialect: 'postgres',
  },
  test: {
    use_env_variable: 'DATABASE_TEST',
    dialect: 'postgres',
  },
  production: {
    use_env_variable: 'DATABASE_PRODUCTION',
    dialect: 'postgres',
  },
};
