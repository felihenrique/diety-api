import {
  JsonController,
  Get,
  Post,
  Body,
  Authorized,
  BodyParam,
  Param,
  UnauthorizedError,
  HeaderParam,
  Put,
  NotFoundError
} from "routing-controllers";
import User from "./user.model";
import { getRepository } from "typeorm";
import * as bcrypt from "bcrypt";
import * as uuid from "uuid/v4";
import { setTokenData, removeToken } from "../../token";
import { TOKEN_TTL } from "../../config";
import RoleGroup from "./rolegroup.model";
import { Filter } from "../../decorators/Filter";

@JsonController("/users")
export default class UserController {
  userRepository = getRepository<User>(User);

  @Get()
  @Authorized("ADMIN")
  getAllUsers(@Filter() filter: Object) {
    return this.userRepository.find(filter);
  }

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

  @Authorized("OWNER")
  @Put("/:id")
  async updateUser(
    @Body({ validate: { skipMissingProperties: true } }) user: User,
    @Param("id") id: number
  ) {
    user.id = id;
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
    const userRoleGroups = await user.rolesGroups;
    console.log(userRoleGroups);
    await setTokenData(token, {
      userId: user.id,
      expiresAt: Date.now() + TOKEN_TTL,
      // Concat every role group and roles inside role groups
      roles: [
        // To include only unique values
        ...new Set(
          userRoleGroups
            .reduce((prev: Array<string>, next: RoleGroup) => {
              return next.roles
                ? prev.concat(next.roles.map(role => role.name))
                : prev;
            }, [])
            .concat(userRoleGroups.map(group => group.name))
        )
      ]
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

  @Put("/:id/role-groups")
  @Authorized("ADMIN")
  async changeUserRoles(
    @Body() roleGroups: RoleGroup[],
    @Param("id") id: number
  ) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundError();
    }
    user.rolesGroups = Promise.resolve(roleGroups);
    return this.userRepository.save(user);
  }
}
