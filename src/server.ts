import { createKoaServer } from "routing-controllers";
import helmet from "koa-helmet";
import Koa from "koa";
import authorizationChecker from "../src/utils/authorizationChecker";
import currentUserChecker from "../src/utils/currentUserChecker";
import Container from "typedi";
import FakeTokenService from "../test/services/FakeTokenService";
import TokenService from "./services/TokenService";

Container.set(
  "tokenService",
  process.env.NODE_ENV === "test" ? new FakeTokenService() : new TokenService()
);

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

export default app;
