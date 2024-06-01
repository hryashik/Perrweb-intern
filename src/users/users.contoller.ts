import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException();

    const { hash, ...result } = user;
    return result;
  }
}
