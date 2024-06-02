import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from "@nestjs/common";
import { JwtAuthGuard } from "../guards/jwtAuthGuard";
import { CreateCardDto } from "./dto/CreateCardDto";
import { CardsService } from "./cards.service";
import { GetUser } from "../decorators/getUser.decorator";

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
}
