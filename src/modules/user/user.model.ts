import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { IsEmail, IsNotEmpty } from "class-validator";
import { IsEmailUnique } from "../../validators/isEmailUnique";
import Food from "../food/food.model";
import { Exclude } from "class-transformer";

@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty({
    message: "O nome é obrigatório"
  })
  @Column()
  name: string;

  @IsEmailUnique({
    message: "O email já está sendo usado"
  })
  @IsEmail(
    {},
    {
      message: "O email é obrigatório"
    }
  )
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

  @OneToMany(type => Food, food => food.user)
  foods: Promise<Food[]>;
}
