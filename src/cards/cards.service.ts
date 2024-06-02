import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCardDto } from "./dto/CreateCardDto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCard(dto: CreateCardDto) {
    try {
      return await this.prisma.cards.create({ data: dto });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === "P2003"
      ) {
        throw new NotFoundException({
          error: "Column doesn't exist",
        });
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllCardsByUserId(userId: number) {
    try {
      return this.prisma.cards.findMany({
        where: { columns: { user_id: userId } },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllCardsByColumnId(columnId: number) {
    try {
      return this.prisma.cards.findMany({ where: { column_id: columnId } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
