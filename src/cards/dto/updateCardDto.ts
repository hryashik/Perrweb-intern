import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateCardDto {
  @ApiProperty({
    example: "Some title",
    description: "The title of the card",
    required: false,
  })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({
    example: "Some text",
    description: "Description of the card",
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 5,
    description: "Position in the list",
    required: false,
  })
  @IsNumber()
  @IsOptional()
  position?: number;
}
