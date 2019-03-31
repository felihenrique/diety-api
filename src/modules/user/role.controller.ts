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
import Role from "./role.model";
import { Filter } from "../../decorators/Filter";

@JsonController("/roles")
export default class RoleController {
  @Get()
  @Authorized("ADMIN")
  getRoles(@Filter() @QueryParam("filter") filter: Object) {
    return Role.find(filter);
  }

  @Post()
  @Authorized("ADMIN")
  createRole(@Body() role: Role) {
    return role.save();
  }

  @Put("/:id")
  @Authorized("ADMIN")
  editRole(
    @Param("id") id: number,
    @Body({ validate: { skipMissingProperties: true } }) role: Role
  ) {
    role.id = id;
    return role.save();
  }

  @Delete("/:id")
  @Authorized("ADMIN")
  deleteRole(@Param("id") id: number) {
    return Role.delete(id);
  }
}
