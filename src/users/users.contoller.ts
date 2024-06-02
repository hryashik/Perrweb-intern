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
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { UsersService } from "./users.service";
import { GetUser } from "../decorators/getUser.decorator";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { ColumnsService } from "../columns/columns.service";
import { UpdateColumnDto } from "../columns/dto/updateColumn.dto";
import { PermissionsGuard } from "../guards/permissionsGuard";

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

  @UseGuards(PermissionsGuard)
  @HttpCode(201)
  @Patch(":id")
  async updateUser(
    @Param("id", ParseIntPipe) id: number,
    @GetUser() user: any,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(updateUserDto, user.id);
  }

  @Get("/:userId/columns/")
  getAllColumns(@Param("userId", ParseIntPipe) userId: number) {
    return this.columnsService.getAllColumnsByUserId(userId);
  }

  @Get("/:userId/columns/:columnId")
  getColumn(@Param("columnId", ParseIntPipe) columnId: number) {
    return this.columnsService.getColumnById(columnId);
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "columnId")
  @Patch("/:userId/columns/:columnId")
  @HttpCode(201)
  updateColumn(
    @Param("columnId", ParseIntPipe) columnId: number,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnsService.updateColumnById(dto, columnId);
  }
}
