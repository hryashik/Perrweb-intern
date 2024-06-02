import { ApiProperty } from "@nestjs/swagger";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from "class-validator";

export class CreateCardDto {
  @ApiProperty({ example: 1, description: "Card id" })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  column_id: number;

  @ApiProperty({
    example: "Some text",
    description: "Description of the card",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: "Some title",
    description: "Title of the card",
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 5, description: "Position in the list" })
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  position: number;
}
