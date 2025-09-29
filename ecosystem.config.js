module.exports = {
    apps: [
      {
        name: "website-backend",
        script: "src/server.js",
        env: {
          NODE_ENV: "development"
        },
        env_production: {
          NODE_ENV: "production"
        }
      }
    ]
  }
  