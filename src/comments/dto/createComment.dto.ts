import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator";

export class CreateCommentDto {
  @ApiProperty({
    example: 1,
    description: "Id of the card",
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  card_id: number;

  @ApiProperty({
    example: "Some text",
    description: "Content of the message",
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
