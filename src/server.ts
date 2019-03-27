import { createKoaServer, Action } from "routing-controllers";
import { createConnection } from "typeorm";
import * as helmet from "koa-helmet";
import * as Koa from "koa";
import { getTokenData, removeToken } from "./token";
import {isPast} from 'date-fns';

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
    authorizationChecker: async (action: Action, roles: String[]) => {
      const token: string = action.request.headers["authorization"];
      // User does not passed the token
      if (!token) return false;
      const tokenData = await getTokenData(token);
      // Token does not exists
      if (!tokenData) return false;
      // Token has expired
      if(isPast(tokenData.expiresAt)) {
        await removeToken(token);
        return false;
      }
      if(roles.includes("OWNER")) {
        return tokenData.userId === parseInt(action.context.params.id);
      }
      return true;
    },
    currentUserChecker: async (action: Action) => {
      const token: string = action.request.headers["authorization"];
      const data = await getTokenData(token);
      if(!data) {
        return null;
      }
      return data.userId;
    }
  });
  app.use(helmet());
  app.listen(3000, "0.0.0.0");
  console.log("App running on port 3000");
})();
