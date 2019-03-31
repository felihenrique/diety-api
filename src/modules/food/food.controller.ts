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

@JsonController()
export default class FoodController {
  @Authorized("ADMIN")
  @Get("/foods")
  getAllFoods(@Filter() filter: Object) {
    return User.find(filter);
  }

  @Authorized("OWNER")
  @Get("/users/:id/foods")
  getUserFoods(@Param("id") id: number, @Filter() filter: any) {
    filter.where = {
      ...filter.where,
      user: { id }
    };
    return User.find(filter);
  }

  @Post("/users/:id/foods")
  @Authorized("OWNER")
  createUserFood(@Body() food: Food, @Param("id") id: number) {
    food.user = User.create({ id });
    return food.save();
  }

  @Put("/users/:id/foods/:foodId")
  @Authorized("OWNER")
  modifyUserFood(
    @Body({ validate: { skipMissingProperties: true } }) food: Food,
    @Param("foodId") foodId: number
  ) {
    food.id = foodId;
    return food.save();
  }
}
