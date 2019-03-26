import {
  JsonController,
  Post,
  Body,
  Param,
  Get,
  Authorized
} from "routing-controllers";
import Food from "./food.model";
import User from "../user/user.model";
import { getRepository } from "typeorm";

@JsonController()
export default class FoodController {
  userRepository = getRepository<User>(User);
  foodRepository = getRepository<Food>(Food);

  @Get("/foods")
  async getAllFoods() {
    return this.foodRepository.find({ loadRelationIds: true });
  }

  @Authorized("OWNER")
  @Get("/users/:id/foods")
  async getUserFood(@Param("id") id: number) {
    const foods = await this.foodRepository.find({
      where: { user: { id } },
      loadRelationIds: true
    });
    return foods;
  }

  @Post("/users/:id/foods")
  @Authorized("OWNER")
  async createUserFood(@Body() food: Food, @Param("id") id: number) {
    food.user = this.userRepository.create({ id });
    return this.foodRepository.save(food);
  }
}
