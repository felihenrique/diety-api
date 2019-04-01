import { Action, NotFoundError, BadRequestError } from "routing-controllers";
import { getRepository } from "typeorm";
import { TokenData } from "../token";

export default async function(
  action: Action,
  model: string,
  tokenData: TokenData
): Promise<boolean> {
  const modelRepository = getRepository(model);
  if (!modelRepository) {
    throw new NotFoundError();
  }
  const id = action.context.params.id;
  const entity: any = await modelRepository.findOne(id);
  if (!entity) {
    throw new NotFoundError();
  }
  if (model !== "User" && !("userId" in entity)) {
    throw new BadRequestError("Não é possivel checar o owner do modelo");
  }
  return tokenData.userId === (model === "User" ? entity.id : entity.userId);
}
