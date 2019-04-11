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
import { Filter } from "../../decorators/Filter";
import RoleGroup from "./rolegroup.model";
import { getRepository } from "typeorm";

@JsonController("/role-groups")
export default class RoleGroupController {
  private roleGroupRepository = getRepository(RoleGroup);

  @Get()
  @Authorized("ADMIN")
  getRoles(@Filter() @QueryParam("filter") filter: Object) {
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
