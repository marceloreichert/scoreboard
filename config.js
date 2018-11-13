const path = require('path');
const dotenv = require('dotenv');

const dotEnvPath = path.resolve(`./.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`);

dotenv.config({ path: dotEnvPath });
const env = process.env;

const config = {
  database: {
    url: {
      production: env.MONGO_URL,
      test: env.MONGO_URL_TEST
    }
  },
  github: {
    user: env.GITHUB_USER,
    password: env.GITHUB_PASSWORD
  }
};

module.exports = config;
