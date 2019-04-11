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
import { getRepository } from "typeorm";

@JsonController()
export default class FoodController {
  private foodRepository = getRepository(Food);
  private userRepository = getRepository(User);

  @Authorized("ADMIN")
  @Get("/foods")
  getAllFoods(@Filter() filter: Object) {
    return this.foodRepository.find(filter);
  }

  @Authorized(Or(["OWNER:User", "ADMIN"]))
  @Get("/users/:id/foods")
  getUserFoods(@Param("id") id: number, @Filter() filter: any) {
    filter.where = {
      ...filter.where,
      user: { id }
    };
    return this.foodRepository.find(filter);
  }

  @Post("/users/:id/foods")
  @Authorized("OWNER:User")
  createUserFood(@Body() food: Food, @Param("id") id: number) {
    food.user = this.userRepository.create({ id });
    return this.foodRepository.save(food);
  }

  @Put("/users/:id/foods/:foodId")
  @Authorized("OWNER:User")
  modifyUserFood(
    @Body({ validate: { skipMissingProperties: true } }) food: Food,
    @Param("foodId") foodId: number
  ) {
    food.id = foodId;
    return this.foodRepository.save(food);
  }
}
