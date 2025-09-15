require('dotenv-flow').config(); // بارگذاری env فقط یک بار

const ENV = process.env.NODE_ENV || 'development';

const config = {
  env: ENV,

  app: {
    port: process.env.PORT || 8000,
    host: process.env.API_HOST || `http://localhost:${process.env.PORT || 8000}`,
  },

  db: {
    uri: process.env.DB_URI || 'mongodb://127.0.0.1:27017/kahrobaDB',
  },

  log: {
    level: process.env.LOG_LEVEL || 'info',
  },

  features: {
    enableCoolFeature: process.env.ENABLE_COOL_FEATURE === 'true',
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

module.exports = config;
