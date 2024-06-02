import { Body, Controller, HttpCode, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignupDto } from "./dto/signup.dto";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: "Signup user" })
  @ApiBody({ type: SignupDto })
  @ApiResponse({ status: 201, description: "User was created" })
  @ApiResponse({ status: 400, description: "Incorrect data" })
  @ApiResponse({ status: 409, description: "Credentials is taken" })
  @Post("/signup")
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiOperation({ summary: "Login user" })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: "Correct login" })
  @ApiResponse({ status: 400, description: "Incorrect data in body" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @HttpCode(200)
  @Post("/login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
