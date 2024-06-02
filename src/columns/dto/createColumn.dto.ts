import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateColumnDto {
  @ApiProperty({ example: "first column", description: "Title of the column" })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 1, description: "Position in list" })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  position: number;
}
