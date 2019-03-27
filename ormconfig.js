const path = require('path');

module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "diety_main",
  database: "diety",
  entities: [path.join(__dirname, "src/modules/**/*.model.ts")],
  //synchronize: true,
  logging: true
};
