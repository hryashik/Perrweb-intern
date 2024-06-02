import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateCommentDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  card_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
