import {
  JsonController,
  Post,
  Body,
  Param,
  Get,
  Authorized,
  NotFoundError
} from "routing-controllers";
import Food from "./food.model";
import User from "../user/user.model";
import { getRepository } from "typeorm";
import { hset, hget } from "../../redis";

@JsonController()
export default class FoodController {
  userRepository = getRepository<User>(User);
  foodRepository = getRepository<Food>(Food);

  @Get("/foods")
  async getAllFoods() {
    return this.foodRepository.find({ loadRelationIds: true });
  }

  @Get("/set/:value")
  async setField(@Param("value") value: string) {
    await hset("tokens", value, value);
    return "ok";
  }

  @Get("/get/:value")
  async getField(@Param("value") value: string) {
    const val = await hget("tokens", value);
    return val.toString();
  }

  @Get("/users/:id/foods")
  async getUserFood(@Param("id") id: number) {
    const foods = await this.foodRepository.find({
      where: { user: { id } },
      loadRelationIds: true
    });
    if (foods.length === 0) throw new NotFoundError();
    return foods;
  }

  @Post("/users/:id/foods")
  @Authorized("OWNER")
  async createUserFood(@Body() food: Food, @Param("id") id: number) {
    food.user = this.userRepository.create({ id });
    return this.foodRepository.save(food);
  }
}
