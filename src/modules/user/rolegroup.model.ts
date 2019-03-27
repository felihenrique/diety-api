import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IsNotEmpty, Allow } from "class-validator";

@Entity()
export default class RoleGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column()
  name: string;

  @Allow()
  @Column()
  description: string;

  @IsNotEmpty()
  @Column({ array: true })
  role: number[];

  @Column({
    type: "timestamp",
    default: () => "CURRENT_TIMESTAMP"
  })
  createdAt: Date;
}
