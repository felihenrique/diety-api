import { createKoaServer } from "routing-controllers";
import { createConnection } from "typeorm";
import helmet from "koa-helmet";
import Koa from "koa";
import authorizationChecker from "../src/utils/authorizationChecker";
import currentUserChecker from "../src/utils/currentUserChecker";

export default createConnection().then(() => {
  console.info("Connection created");
  const app: Koa = createKoaServer({
    controllers: [__dirname + "/**/*.controller.ts"],
    classTransformer: true,
    validation: {
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false }
    },
    authorizationChecker,
    currentUserChecker
  });
  app.use(helmet());
  return app;
});
