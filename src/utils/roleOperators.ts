import { TokenData } from "../token";
import isOwnerChecker from "./isOwnerChecker";
import { Action } from "routing-controllers";

export interface Operator {
  (tokenData: TokenData, action: Action): Promise<boolean>;
}

async function verifyRoles(
  roles: string[],
  tokenData: TokenData,
  action: Action
): Promise<boolean[]> {
  return await Promise.all(
    roles.map(async role => {
      if (role.startsWith("OWNER:")) {
        const model = role.split(":")[1];
        return isOwnerChecker(action, model, tokenData);
      }
      return tokenData.roles.includes(role);
    })
  );
}

export function Or(roles: string[]) {
  return async function(
    tokenData: TokenData,
    action: Action
  ): Promise<boolean> {
    const rolesResult = await verifyRoles(roles, tokenData, action);
    return rolesResult.some(result => result);
  };
}

export function And(roles: string[]) {
  return async function(
    tokenData: TokenData,
    action: Action
  ): Promise<boolean> {
    const rolesResult = await verifyRoles(roles, tokenData, action);
    return rolesResult.every(result => result);
  };
}
