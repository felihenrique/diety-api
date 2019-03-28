import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  BodyParam,
  Param,
  UnauthorizedError,
  HeaderParam
} from "routing-controllers";
import User from "./user.model";
import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid/v4";
import { setTokenData, removeToken } from "../../token";
import { TOKEN_TTL } from "../../config";

@JsonController("/users")
export default class UserController {
  userRepository = getRepository<User>(User);

  @Get("/:id")
  @Authorized("OWNER")
  getById(@Param("id") id: number) {
    return this.userRepository.findOne(id, { relations: ["profile"] });
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
    @BodyParam("email") email: string,
    @BodyParam("password") password: string
  ) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedError();
    }
    const equal = await bcrypt.compare(password, user.password);
    if (!equal) {
      throw new UnauthorizedError();
    }
    const token = uuid();
    await setTokenData(token, {
      userId: user.id,
      expiresAt: Date.now() + TOKEN_TTL
    });
    return {
      userId: user.id,
      token
    };
  }

  @Post("/logout")
  @Authorized()
  logout(@HeaderParam("authorization") token: string) {
    removeToken(token);
    return { message: "user logged out" };
  }
}
