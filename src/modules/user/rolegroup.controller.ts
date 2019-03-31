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
import { FilterType, Filter } from "../../decorators/Filter";
import RoleGroup from "./rolegroup.model";

@JsonController("/role-groups")
export default class RoleController {
  roleGroupRepository = getRepository(RoleGroup);

  @Get()
  @Authorized("ADMIN")
  getRoles(@Filter() @QueryParam("filter") filter: FilterType) {
    return this.roleGroupRepository.find(filter);
  }

  @Post()
  @Authorized("ADMIN")
  createRole(@Body() role: RoleGroup) {
    return this.roleGroupRepository.save(role);
  }

  @Put("/:id")
  @Authorized("ADMIN")
  editRole(
    @Param("id") id: number,
    @Body({ validate: { skipMissingProperties: true } }) role: RoleGroup
  ) {
    role.id = id;
    return this.roleGroupRepository.save(role);
  }

  @Delete("/:id")
  @Authorized("ADMIN")
  deleteRole(@Param("id") id: number) {
    return this.roleGroupRepository.delete(id);
  }
}
