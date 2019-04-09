const path = require("path");

module.exports = [{
  enviroment: "dev",
  name: "default",
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "diety_main",
  database: "diety",
  entities: [path.join(__dirname, "src/modules/**/*.model.ts")],
  //synchronize: true,
  logging: true
}, {
  environment: "test",
  name: "test",
  type: ":memory:"
}];
