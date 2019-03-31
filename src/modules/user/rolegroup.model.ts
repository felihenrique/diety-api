import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable
} from "typeorm";
import { IsNotEmpty, Allow } from "class-validator";
import Role from "./role.model";

@Entity()
export default class RoleGroup {
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

  @IsNotEmpty()
  @ManyToMany(type => Role, { eager: true })
  @JoinTable()
  roles: Role[];
}
