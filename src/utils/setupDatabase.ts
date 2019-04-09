import User from "../modules/user/user.model";
import roles from "./roles";
import Role from "../modules/user/role.model";
import RoleGroup from "../modules/user/rolegroup.model";

export default async function setupDatabase() {
  const rolesEntities = await Role.createQueryBuilder()
    .insert()
    .values(
      Object.values(roles).map(role => {
        const roleEntity = Role.create({
          name: role
        });
        return roleEntity;
      })
    ).execute();

  const userEntity = User.create({
      email: "admin@admin.com",
      password: "admin123",
      profile: {
          name: "admin"
      }
  });
  const user = await userEntity.save();
  RoleGroup.create({
      
  })
}
