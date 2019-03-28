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
import {
  getRepository,
  DeepPartial,
  LessThanOrEqual,
  Like,
  Equal
} from "typeorm";

@JsonController()
export default class FoodController {
  userRepository = getRepository<User>(User);
  foodRepository = getRepository<Food>(Food);

  @Get("/foods")
  getAllFoods() {
    return this.foodRepository.find({ loadRelationIds: true });
  }

  @Authorized("OWNER")
  @Get("/users/:id/foods")
  getUserFoods(@Param("id") id: number) {
    return this.foodRepository.find({
      where: { id: Equal(6) },
      loadRelationIds: true
    });
  }

  @Post("/users/:id/foods")
  @Authorized("OWNER")
  createUserFood(@Body() food: Food, @Param("id") id: number) {
    food.user = this.userRepository.create({ id });
    return this.foodRepository.save(food);
  }

  @Put("/users/:id/foods/:foodId")
  @Authorized("OWNER")
  modifyUserFood(
    @Body({ validate: { skipMissingProperties: true } }) food: Food,
    @Param("foodId") foodId: number
  ) {
    return this.foodRepository.update(foodId, food);
  }
}
