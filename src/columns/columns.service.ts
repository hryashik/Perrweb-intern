import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateColumnDto } from "./dto/createColumn.dto";
import { UpdateColumnDto } from "./dto/updateColumn.dto";

@Injectable()
export class ColumnsService {
  constructor(private readonly prisma: PrismaService) {}

  async createColumn(dto: CreateColumnDto, userId: number) {
    try {
      return await this.prisma.columns.create({
        data: { user_id: userId, ...dto },
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getColumnById(id: number) {
    try {
      return await this.prisma.columns.findUnique({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async getAllColumnsByUserId(userId: number) {
    try {
      return await this.prisma.columns.findMany({ where: { user_id: userId } });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async updateColumnById(dto: UpdateColumnDto, columnId: number) {
    try {
      return await this.prisma.columns.update({
        where: { id: columnId },
        data: dto,
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException();
    }
  }
}
