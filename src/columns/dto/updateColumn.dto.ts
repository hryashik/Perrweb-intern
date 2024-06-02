import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateColumnDto {
  @ApiProperty({ example: "First column", description: "Title of the column" })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ example: 10, description: "Position in list" })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  position?: number;
}
