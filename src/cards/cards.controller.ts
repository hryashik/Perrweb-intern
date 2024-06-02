import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  SetMetadata,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import { CreateCardDto } from "./dto/CreateCardDto";
import { CardsService } from "./cards.service";
import { GetUser } from "../decorators/getUser.decorator";
import { UpdateCardDto } from "./dto/updateCardDto";
import { PermissionsGuard } from "../guards/permissionsGuard";

@UseGuards(JwtAuthGuard)
@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Post("/")
  @HttpCode(201)
  createCard(@Body() dto: CreateCardDto) {
    return this.cardsService.createCard(dto);
  }

  @Get("/")
  getAllCardsByUserId(@GetUser() user: any) {
    return this.cardsService.getAllCardsByUserId(user.id);
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Patch(":cardId")
  updateCard(
    @Body() dto: UpdateCardDto,
    @Param("cardId", ParseIntPipe) cardId: number,
  ) {
    return this.cardsService.updateCardById(dto, cardId);
  }

  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Delete(":cardId")
  deleteCard(@Param("cardId", ParseIntPipe) cardId: number) {
    return this.cardsService.deleteCardById(cardId);
  }

  @Get(":cardId/comments")
  getComments(@Param("cardId", ParseIntPipe) cardId: number) {
    return this.cardsService.getAllCommentsByCardId(cardId);
  }
}
