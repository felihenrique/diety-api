import { createKoaServer, Action } from "routing-controllers";
import { createConnection, getRepository } from "typeorm";
import * as helmet from "koa-helmet";
import * as Koa from "koa";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config";

(async function() {
  await createConnection();
  const app: Koa = createKoaServer({
    controllers: [__dirname + "/**/*.controller.ts"],
    classTransformer: true,
    validation: {
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      validationError: { target: false }
    },
    authorizationChecker: (action: Action, roles: String[]) => {
      const token: string = action.request.headers["authorization"];
      if (!token) return false;
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        if (roles.includes("OWNER")) {
          return parseInt(action.context.params.id) === payload.userId;
        }
        return true;
      } catch (err) {
        return false;
      }
    },
    currentUserChecker: async (action: Action) => {
      const token: string = action.request.headers["authorization"];
      if (!token) return null;
      try {
        const payload: any = jwt.verify(token, JWT_SECRET);
        return payload.userId;
      } catch (err) {
        return null;
      }
    }
  });
  app.use(helmet());
  app.listen(3000, "0.0.0.0");
  console.log("App running on port 3000");
})();
