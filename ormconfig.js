module.exports = {
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "diety_main",
  database: "diety",
  entities: [__dirname + "/**/*.model.ts"],
  //synchronize: true
  logging: true
};
