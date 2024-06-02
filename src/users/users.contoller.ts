import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import {
  Body,
  Controller,
  Delete,
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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Users")
@UseGuards(JwtAuthGuard)
@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly columnsService: ColumnsService,
  ) {}

  @ApiOperation({ summary: "Get user" })
  @ApiBody({ required: false })
  @ApiResponse({ status: 200, description: "User info" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiParam({ name: "id", type: Number, example: 1 })
  @Get(":id")
  async getUser(@Param("id", ParseIntPipe) id: number) {
    const user = await this.usersService.findOneById(id);
    if (!user) throw new NotFoundException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { hash, ...result } = user;
    return result;
  }

  @ApiOperation({ summary: "Update user" })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 201, description: "User was updated" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiParam({ name: "id", type: Number, example: 1 })
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

  @ApiOperation({ summary: "Get columns by userId" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User not found" })
  @ApiParam({ name: "userId", type: Number, example: 1 })
  @Get("/:userId/columns/")
  getAllColumns(@Param("userId", ParseIntPipe) userId: number) {
    return this.columnsService.getAllColumnsByUserId(userId);
  }

  @ApiOperation({ summary: "Get column by userId" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({
    status: 404,
    description: "User not found or column not found",
  })
  @ApiParam({ name: "userId", type: Number, example: 1 })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @Get("/:userId/columns/:columnId")
  getColumn(@Param("columnId", ParseIntPipe) columnId: number) {
    return this.columnsService.getColumnById(columnId);
  }

  @ApiOperation({ summary: "Update column by userId" })
  @ApiBody({ type: UpdateColumnDto })
  @ApiResponse({ status: 201, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "User or column not found" })
  @ApiParam({ name: "userId", type: Number, example: 1 })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
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

  @ApiOperation({ summary: "Delete column by userId" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "User or column not found" })
  @ApiParam({ name: "userId", type: Number, example: 1 })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "columnId")
  @Delete("/:userId/columns/:columnId")
  deleteColumn(@Param("columnId", ParseIntPipe) columnId: number) {
    return this.columnsService.deleteColumn(columnId);
  }
}
