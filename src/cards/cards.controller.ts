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
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

@ApiTags("Cards")
@ApiBearerAuth("Authorization")
@UseGuards(JwtAuthGuard)
@Controller("cards")
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @ApiOperation({ summary: "Create card" })
  @ApiBody({ type: CreateCardDto })
  @ApiResponse({ status: 201, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post("/")
  @HttpCode(201)
  createCard(@Body() dto: CreateCardDto) {
    return this.cardsService.createCard(dto);
  }

  @ApiOperation({ summary: "Get cards" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Get("/")
  getAllCardsByUserId(@GetUser() user: any) {
    return this.cardsService.getAllCardsByUserId(user.id);
  }

  @ApiOperation({ summary: "Update card" })
  @ApiBody({ type: UpdateCardDto })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "cardId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Patch(":cardId")
  updateCard(
    @Body() dto: UpdateCardDto,
    @Param("cardId", ParseIntPipe) cardId: number,
  ) {
    return this.cardsService.updateCardById(dto, cardId);
  }

  @ApiOperation({ summary: "Delete card" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "cardId", type: Number, example: 1 })
  @UseGuards(PermissionsGuard)
  @SetMetadata("paramName", "cardId")
  @Delete(":cardId")
  deleteCard(@Param("cardId", ParseIntPipe) cardId: number) {
    return this.cardsService.deleteCardById(cardId);
  }

  @ApiOperation({ summary: "Get comments of card" })
  @ApiResponse({ status: 200, description: "OK" })
  @ApiResponse({ status: 400, description: "Bad request" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @ApiResponse({ status: 403, description: "Permission denied" })
  @ApiResponse({ status: 404, description: "Not found" })
  @ApiParam({ name: "cardId", type: Number, example: 1 })
  @Get(":cardId/comments")
  getComments(@Param("cardId", ParseIntPipe) cardId: number) {
    return this.cardsService.getAllCommentsByCardId(cardId);
  }
}
