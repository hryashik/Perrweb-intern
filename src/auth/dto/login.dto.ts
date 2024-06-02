import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({
    example: "test@test.ru",
    description: "The email of the user",
  })
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @ApiProperty({
    example: "123test",
    description: "The password of the user",
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
