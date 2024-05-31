import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
