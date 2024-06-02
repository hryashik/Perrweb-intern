import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateColumnDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  position: number;
}
