import { createParamDecorator, BadRequestError } from "routing-controllers";
import {
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Equal,
  Like,
  In,
  Any,
  IsNull
} from "typeorm";

const funcMap = {
  Not,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Equal,
  Like,
  In,
  Any,
  IsNull
};

function parseKeys(where) {
  const keys = Object.keys(where);
  keys.forEach(key => {
    if (typeof where[key] !== "object") {
      return;
    }

    const [fieldKey] = Object.keys(where[key]);

    if (!(fieldKey in funcMap)) {
      throw new BadRequestError(`Operador usado em ${key} não é suportado`);
    }
    if (fieldKey === "Not" && typeof where[key][fieldKey] === "object") {
      const [InnerNotKey] = Object.keys(where[key][fieldKey]);
      where[key] = funcMap["Not"](
        funcMap[InnerNotKey](where[key]["Not"][InnerNotKey])
      );
    } else {
      where[key] = funcMap[fieldKey](where[key][fieldKey]);
    }
  });
}

export function Filter() {
  return createParamDecorator({
    value: action => {
      let filter = action.context.query.filter;
      if (!filter) {
        return null;
      }
      filter = JSON.parse(filter);
      const where = filter.where;
      if (where) {
        if (Array.isArray(where)) {
          where.forEach(w => parseKeys(w));
        } else if (typeof where === "object") {
          parseKeys(where);
        }
      }
      return filter;
    }
  });
}
