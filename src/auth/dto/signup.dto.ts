import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignupDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(6)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  password: string;
}
