import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("/signup")
  async signup(@Body() signupDto: SignupDto) {
    console.log(signupDto);
    return this.authService.createUser();
  }

  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    console.log(loginDto);
    return "hello!";
  }
}
