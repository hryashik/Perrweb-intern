import { Body, Controller, Post } from "@nestjs/common";
import { LoginUserDto } from "src/dto/login.dto";
import { PrismaService } from "src/prisma/prisma.service";

@Controller("auth")
export class AuthController {
  constructor(private prisma: PrismaService) {}
  @Post("/signup")
  async signup() {
    return "hello";
  }
  @Post("/login")
  async login(@Body() loginDto: LoginUserDto) {
    console.log(loginDto);
    return "hello!";
  }
}
