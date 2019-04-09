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
  logging: true,
  cli: {
    migrationsDir: 'src/migrations',
  }
}, {
  environment: "test",
  name: "test",
  type: ":memory:",
  entities: [path.join(__dirname, "src/modules/**/*.model.ts")],
}];
