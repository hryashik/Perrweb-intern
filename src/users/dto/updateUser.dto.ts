import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @ApiProperty({
    example: "test@test.ru",
    description: "Email of the user",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  @MinLength(6)
  email?: string;

  @ApiProperty({
    example: "123123test",
    description: "Password of the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({
    example: "john_doe",
    description: "The username of the user",
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  username?: string;
}
