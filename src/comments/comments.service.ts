import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaService) {}

  async createComment(dto: {
    user_id: number;
    card_id: number;
    content: string;
  }) {
    try {
      return await this.prisma.comments.create({ data: dto });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getCommentById(id: number) {
    try {
      return await this.prisma.comments.findUnique({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllCommentsByCardId(cardId: number) {
    try {
      return await this.prisma.comments.findMany({
        where: { card_id: cardId },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllCommentsByUserId(userId: number) {
    try {
      return await this.prisma.comments.findMany({
        where: { user_id: userId },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async deleteCommentById(commentId: number) {
    try {
      return await this.prisma.comments.findMany({
        where: { id: commentId },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException();
      }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
