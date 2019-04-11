import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column
} from "typeorm";
import User from "../user/user.model";
import { IsNotEmpty, ValidateNested, Allow } from "class-validator";
import { Type } from "class-transformer";

class Nutrient {
  @IsNotEmpty({ message: "A quantidade é obrigatória" })
  quantity: number;
  @IsNotEmpty({ message: "A unidade de medida é obrigatória" })
  unit: string;
}

class NutrientList {
  @IsNotEmpty({ message: "A quantidade de proteínas é obrigatória" })
  @ValidateNested()
  @Type(type => Nutrient)
  protein: Nutrient;

  @IsNotEmpty({ message: "A quantidade de gorduras saturadas é obrigatória" })
  @ValidateNested()
  @Type(type => Nutrient)
  saturatedFat: Nutrient;

  @IsNotEmpty({ message: "A quantidade de gorduras totais é obrigatória" })
  @ValidateNested()
  @Type(type => Nutrient)
  totalFat: Nutrient;

  @IsNotEmpty({ message: "A quantidade de carboídratos é obrigatório" })
  @ValidateNested()
  @Type(type => Nutrient)
  carbohydrates: Nutrient;

  @Allow()
  iron?: number;
}

class UnitMeasure {
  @IsNotEmpty({ message: "O nome da unidade de medida é obrigatório" })
  name: string;
  @IsNotEmpty({ message: "A quantidade da unidade de medida é obrigatória" })
  quantity: number;
}

@Entity()
export default class Food {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty({ message: "O nome é obrigatório" })
  name: string;

  @Column()
  @IsNotEmpty({ message: "A categoria é obrigatória" })
  category: string;

  @Column({ type: process.env.NODE_ENV === 'test' ? "simple-json" : "json", nullable: true })
  @ValidateNested()
  @Type(type => UnitMeasure)
  units: UnitMeasure[];

  @Column({ type: process.env.NODE_ENV === 'test' ? "simple-json" : "json"})
  @ValidateNested()
  @Type(type => NutrientList)
  @IsNotEmpty()
  nutrients: NutrientList;

  @ManyToOne(type => User, user => user.foods)
  user: User;
}
