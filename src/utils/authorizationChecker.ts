import { Action } from "routing-controllers";
import { isPast } from "date-fns";
import isOwnerChecker from "./isOwnerChecker";
import { Operator } from "./roleOperators";
import Container from "typedi";
import { TokenService } from "../services/TokenService";

export default async function(action: Action, roles: string[]) {
    const tokenService = Container.get(TokenService);
    const token: string = action.request.headers["authorization"];
    // User does not passed the token
    if (!token) return false;
    const tokenData = await tokenService.get(token);
    // Token does not exists
    if (!tokenData) return false;
    // Token has expired
    if (isPast(tokenData.expiresAt)) {
      await tokenService.remove(token);
      return false;
    }
    // Only consider first role, in case of more than one, use operators
    const role: any = roles[0];
    // No roles, deny
    if (!role) {
      return false;
    }
    switch (typeof role) {
      case "string":
        return role.startsWith("OWNER:")
          ? await isOwnerChecker(action, role.split(":")[1], tokenData)
          : tokenData.roles.includes(role);
      case "function":
        return await (role as Operator)(tokenData, action);
      default:
        return false;
    }
  }