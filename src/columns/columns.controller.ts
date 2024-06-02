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

@UseGuards(JwtAuthGuard)
@Controller("columns")
export class ColumnsController {
  constructor(
    private readonly columnsService: ColumnsService,
    private readonly cardsService: CardsService,
  ) {}

  @Post("/")
  createColumn(@Body() dto: CreateColumnDto, @GetUser() user: any) {
    if (!user.id) throw new UnauthorizedException();
    return this.columnsService.createColumn(dto, user.id);
  }

  @Get("/")
  getAllColumns(@GetUser() user: any) {
    if (!user.id) throw new UnauthorizedException();
    return this.columnsService.getAllColumnsByUserId(user.id);
  }

  @Get(":columnId")
  getColumnById(@Param("columnId", ParseIntPipe) columnId: number) {
    return this.columnsService.getColumnById(columnId);
  }

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

  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "columnId")
  @Delete(":columnId")
  deleteColumn(@Param("columnId", ParseIntPipe) columndId: number) {
    return this.columnsService.deleteColumn(columndId);
  }

  @Get(":columnId/cards")
  async getCardsByColumnId(@Param("columnId", ParseIntPipe) columnId: number) {
    const column = await this.columnsService.getColumnById(columnId);
    if (!column) throw new NotFoundException();
    return (await this.columnsService.getCardsByColumnId(columnId)).cards;
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Patch(":columnId/cards/:cardId")
  async updateCardByColumnId(
    @Param("cardId", ParseIntPipe) cardId: number,
    @Body() dto: UpdateCardDto,
  ) {
    return this.cardsService.updateCardById(dto, cardId);
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Delete(":columnId/cards/:cardId")
  async deleteCardByColumn(@Param("cardId", ParseIntPipe) cardId: number) {
    return this.cardsService.deleteCardById(cardId);
  }
}
