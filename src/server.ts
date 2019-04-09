import { createKoaServer } from "routing-controllers";
import helmet from "koa-helmet";
import Koa from "koa";
import authorizationChecker from "../src/utils/authorizationChecker";
import currentUserChecker from "../src/utils/currentUserChecker";

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

const server = app.listen(3000, "0.0.0.0");

export default server;
