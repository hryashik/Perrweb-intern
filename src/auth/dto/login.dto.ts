import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
