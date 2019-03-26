import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  BodyParam,
  Param,
  CurrentUser,
  ForbiddenError,
  UnauthorizedError
} from "routing-controllers";
import User from "./user.model";
import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config";

@JsonController("/users")
export default class UserController {
  userRepository = getRepository<User>(User);

  @Get("/:id")
  @Authorized("OWNER")
  async getById(@Param("id") id: number) {
    return this.userRepository.findOne(id);
  }

  @Post()
  async create(
    @Body() user: User,
    @BodyParam("password", { required: true }) password: string
  ) {
    user.password = await bcrypt.hash(password, 5);
    return this.userRepository.save(user);
  }

  @Post("/login")
  async login(
    @BodyParam("email") email: String,
    @BodyParam("password") password: String
  ) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError();
    }
    const equal = await bcrypt.compare(password, user.password);
    if (!equal) {
      throw new UnauthorizedError();
    }
    return {
      userId: user.id,
      token: jwt.sign({ userId: user.id }, JWT_SECRET)
    };
  }
}
