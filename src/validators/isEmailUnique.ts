import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from "class-validator";
import { getRepository } from "typeorm";
import User from "../modules/user/user.model";

@ValidatorConstraint({ async: true })
class IsEmailUniqueConstraint implements ValidatorConstraintInterface {
  async validate(email: String) {
    const count = await getRepository<User>(User).count({
      where: {
        email
      }
    });
    return count === 0;
  }
}

export function IsEmailUnique(options?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: IsEmailUniqueConstraint
    });
  };
}
