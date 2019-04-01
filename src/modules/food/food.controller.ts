import {
  JsonController,
  Post,
  Body,
  Param,
  Get,
  Authorized,
  Put
} from "routing-controllers";
import Food from "./food.model";
import User from "../user/user.model";
import { Filter } from "../../decorators/Filter";
import { Or } from "../../utils/roleOperators";

@JsonController()
export default class FoodController {
  @Authorized("ADMIN")
  @Get("/foods")
  getAllFoods(@Filter() filter: Object) {
    return Food.find(filter);
  }

  @Authorized(Or(["OWNER:User", "ADMIN"]))
  @Get("/users/:id/foods")
  getUserFoods(@Param("id") id: number, @Filter() filter: any) {
    filter.where = {
      ...filter.where,
      user: { id }
    };
    return Food.find(filter);
  }

  @Post("/users/:id/foods")
  @Authorized("OWNER:User")
  createUserFood(@Body() food: Food, @Param("id") id: number) {
    food.user = User.create({ id });
    return food.save();
  }

  @Put("/users/:id/foods/:foodId")
  @Authorized("OWNER:User")
  modifyUserFood(
    @Body({ validate: { skipMissingProperties: true } }) food: Food,
    @Param("foodId") foodId: number
  ) {
    food.id = foodId;
    return food.save();
  }
}
