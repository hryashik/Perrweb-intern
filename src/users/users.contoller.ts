import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { GetUser } from "../decorators/getUser.decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...result } = user;
    return result;
  }

  @Patch(":id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    if (user.id !== id) throw new ForbiddenException();
    return this.usersService.updateUser(updateUserDto, user.id);
  }
}
