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

@JsonController("/role-groups")
export default class RoleController {
  @Get()
  @Authorized("ADMIN")
  getRoles(@Filter() @QueryParam("filter") filter: Object) {
    return RoleGroup.find(filter);
  }

  @Post()
  @Authorized("ADMIN")
  createRole(@Body() role: RoleGroup) {
    return role.save();
  }

  @Put("/:id")
  @Authorized("ADMIN")
  editRole(
    @Param("id") id: number,
    @Body({ validate: { skipMissingProperties: true } }) role: RoleGroup
  ) {
    role.id = id;
    return role.save();
  }

  @Delete("/:id")
  @Authorized("ADMIN")
  deleteRole(@Param("id") id: number) {
    return RoleGroup.delete(id);
  }
}
