import {
  JsonController,
  Authorized,
  QueryParam,
  Body,
  Get,
  Post,
  Delete,
  Param,
  Put
} from "routing-controllers";
import { getRepository } from "typeorm";
import Role from "./role.model";
import { FilterType, Filter } from "../../decorators/Filter";

@JsonController("/roles")
export default class RoleController {
  roleRepository = getRepository(Role);

  @Get()
  @Authorized("ADMIN")
  getRoles(@Filter() @QueryParam("filter") filter: FilterType) {
    return this.roleRepository.find(filter);
  }

  @Post()
  @Authorized("ADMIN")
  createRole(@Body() role: Role) {
    return this.roleRepository.save(role);
  }

  @Put("/:id")
  @Authorized("ADMIN")
  editRole(
    @Param("id") id: number,
    @Body({ validate: { skipMissingProperties: true } }) role: Role
  ) {
    role.id = id;
    return this.roleRepository.save(role);
  }

  @Delete("/:id")
  @Authorized("ADMIN")
  deleteRole(@Param("id") id: number) {
    return this.roleRepository.delete(id);
  }
}
