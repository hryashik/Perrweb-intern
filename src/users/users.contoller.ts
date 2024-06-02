import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { GetUser } from "../decorators/getUser.decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { CheckPermissionsGuard } from "../guards/checkRightsGuard";
import { ColumnsService } from "src/columns/columns.service";

@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly columnsService: ColumnsService,
  ) {}

  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...result } = user;
    return result;
  }

  @UseGuards(CheckPermissionsGuard)
  @HttpCode(201)
  @Patch(":id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(updateUserDto, user.id);
  }

  @Get("/:userId/columns/:columnId")
  getColumn(@Param("columnId", ParseIntPipe) columnId: number) {
    return this.columnsService.getColumnById(columnId);
  }
}
