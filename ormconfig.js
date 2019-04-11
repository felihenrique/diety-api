const path = require("path");

const enviroment = process.env.NODE_ENV

if(enviroment === "test") {
  module.exports = {
    name: "default",
    type: "sqlite",
    synchronize: true,
    database: ":memory:",
    entities: [path.join(__dirname, "src/modules/**/*.model.ts")]
  };
}
else if(enviroment === "dev") {
  module.exports = {
    name: "default",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "diety_main",
    database: "diety",
    entities: [path.join(__dirname, "src/modules/**/*.model.ts")],
    logging: true,
    cli: {
      migrationsDir: "src/migrations"
    }
  };
}
