import { Action } from "routing-controllers";
import Container from "typedi";
import { TokenService } from "../services/TokenService";

export default async function(action: Action) {
  const tokenService = Container.get(TokenService);
  const token: string = action.request.headers["authorization"];
  const data = await tokenService.get(token);
  if (!data) {
    return null;
  }
  return data.userId;
}
