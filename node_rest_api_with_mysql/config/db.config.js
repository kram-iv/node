module.exports = {
    HOST: "localhost",
    USER: "vikram",
    PASSWORD: "vikramhome",
    DB: "simple_rest_api",
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 50000
    }
  };