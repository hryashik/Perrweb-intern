import { IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class UpdateColumnDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsNumber()
  @IsOptional()
  @IsPositive()
  position?: number;
}
