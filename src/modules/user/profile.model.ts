import {
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  Entity,
  BaseEntity
} from "typeorm";
import { IsNotEmpty } from "class-validator";
import User from "./user.model";

@Entity()
export default class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({
    message: "O nome é obrigatório"
  })
  @Column()
  name: string;

  @OneToOne(type => User)
  user: User;
}
