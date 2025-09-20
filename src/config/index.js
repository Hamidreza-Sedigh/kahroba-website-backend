//src/config/index.js
require('dotenv-flow').config(); // بارگذاری env فقط یک بار

const ENV = process.env.NODE_ENV || 'development';

console.log("Testing config index.");
let dbUri;
if (process.env.DB_USER) {
  console.log("LOG TEST - success")
  const user = process.env.DB_USER;
  const pass = encodeURIComponent(process.env.DB_PASS || '');
  dbUri = `mongodb://${user}:${pass}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin`;
  console.log("LOG TEST ->", dbUri);
} else {
  console.log("LOG TEST -> else executed.");
  // بدون یوزر و پسورد (مثلاً حالت local dev)
  dbUri = `mongodb://${process.env.DB_HOST || '127.0.0.1'}:${process.env.DB_PORT || 27017}/${process.env.DB_NAME || 'kahrobaDB'}`;
}

const config = {
  env: ENV,

  app: {
    port: process.env.PORT || 8000,
    host: process.env.API_HOST || `http://localhost:${process.env.PORT || 8000}`,
  },

  db: {
    uri: dbUri
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
