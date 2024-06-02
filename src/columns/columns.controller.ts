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
  Post,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import { CreateColumnDto } from "./dto/createColumn.dto";
import { ColumnsService } from "./columns.service";
import { GetUser } from "../decorators/getUser.decorator";
import { UpdateColumnDto } from "./dto/updateColumn.dto";
import { PermissionsGuard } from "../guards/permissionsGuard";
import { CardsService } from "../cards/cards.service";
import { UpdateCardDto } from "../cards/dto/updateCardDto";
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Columns")
@UseGuards(JwtAuthGuard)
@Controller("columns")
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly cardsService: CardsService,
  ) {}

  @ApiOperation({ summary: "Create column" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiBody({ type: CreateColumnDto })
  @Post("/")
  createColumn(@Body() dto: CreateColumnDto, @GetUser() user: any) {
    if (!user.id) throw new UnauthorizedException();
    return this.columnsService.createColumn(dto, user.id);
  }

  @ApiOperation({ summary: "Get all columns" })
  @ApiResponse({ status: 200, description: "Correct login" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("/")
  getAllColumns(@GetUser() user: any) {
    if (!user.id) throw new UnauthorizedException();
    return this.columnsService.getAllColumnsByUserId(user.id);
  }

  @ApiOperation({ summary: "Get column by id" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "User or column not found" })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @Get(":columnId")
  getColumnById(@Param("columnId", ParseIntPipe) columnId: number) {
    return this.columnsService.getColumnById(columnId);
  }

  @ApiOperation({ summary: "Update column" })
  @ApiBody({ type: UpdateColumnDto })
  @ApiResponse({ status: 201, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "columnId")
  @Patch(":columnId")
  @HttpCode(201)
  updateColumnById(
    @Param("columnId", ParseIntPipe) columnId: number,
    @Body() dto: UpdateColumnDto,
  ) {
    return this.columnsService.updateColumnById(dto, columnId);
  }

  @ApiOperation({ summary: "Delete column" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "columnId")
  @Delete(":columnId")
  deleteColumn(@Param("columnId", ParseIntPipe) columndId: number) {
    return this.columnsService.deleteColumn(columndId);
  }

  @ApiOperation({ summary: "Get cards by columnId" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @Get(":columnId/cards")
  async getCardsByColumnId(@Param("columnId", ParseIntPipe) columnId: number) {
    const column = await this.columnsService.getColumnById(columnId);
    if (!column) throw new NotFoundException();
    return (await this.columnsService.getCardsByColumnId(columnId)).cards;
  }

  @ApiOperation({ summary: "Update card of column" })
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "User or column not found" })
  @ApiParam({ name: "cardId", type: Number, example: 1 })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Patch(":columnId/cards/:cardId")
  async updateCardByColumnId(
    @Param("cardId", ParseIntPipe) cardId: number,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.updateCardById(dto, cardId);
  }

  @ApiOperation({ summary: "Delete card of column" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "cardId", type: Number, example: 1 })
  @ApiParam({ name: "columnId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Delete(":columnId/cards/:cardId")
  async deleteCardByColumn(@Param("cardId", ParseIntPipe) cardId: number) {
    return this.cardsService.deleteCardById(cardId);
  }
}
