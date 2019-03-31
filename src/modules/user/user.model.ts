import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  BaseEntity
} from "typeorm";
import { IsEmail, ValidateNested, IsNotEmpty } from "class-validator";
import { IsEmailUnique } from "../../validators/isEmailUnique";
import Food from "../food/food.model";
import { Exclude, Type } from "class-transformer";
import Profile from "./profile.model";
import RoleGroup from "./rolegroup.model";

@Entity()
export default class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsEmail(
    {},
    {
      message: "O email é obrigatório"
    }
  )
  @IsEmailUnique({
    message: "O email já está sendo usado"
  })
  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @OneToOne(type => Profile, { cascade: true })
  @ValidateNested()
  @Type(type => Profile)
  @IsNotEmpty()
  @JoinColumn()
  profile: Profile;

  @OneToMany(type => Food, food => food.user)
  foods: Promise<Food[]>;

  @ManyToMany(type => RoleGroup)
  @JoinTable()
  rolesGroups: Promise<RoleGroup[]>;
}
