export interface FilterType {
  where: Object;
}

import { createParamDecorator } from "routing-controllers";
import { Not, LessThan } from "typeorm";

const funcMap = {
  not: Not,
  lessThan: LessThan
};

export function Filter() {
  return createParamDecorator({
    value: action => {
      const filter = JSON.parse(action.context.query.filter) as FilterType;
      if (!filter) {
        return null;
      }
      if (filter.where) {
        const keys = Object.keys(filter.where);
        keys.forEach(key => {
          if (typeof filter.where[key] !== "object") {
            return;
          }
          const fieldKeys = Object.keys(filter.where[key]);
          fieldKeys.forEach(fieldKey => {
            filter.where[key][fieldKey] =
              funcMap[key][fieldKey](filter.where[key][fieldKey]) ||
              filter.where[key][fieldKey];
          });
        });
      }
      return filter;
    }
  });
}
