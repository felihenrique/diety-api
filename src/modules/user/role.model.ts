import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { IsNotEmpty, Allow } from "class-validator";
import RoleGroup from "./rolegroup.model";

@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  name: string;

  @Allow()
  @Column({ nullable: true })
  description: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;

  @ManyToMany(type => RoleGroup, roleGroup => roleGroup.roles)
  roleGroups: RoleGroup;
}
