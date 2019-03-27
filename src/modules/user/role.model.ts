import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty, Allow } from "class-validator";

@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  name: string;

  @Allow()
  @Column()
  description: string;

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;
}
