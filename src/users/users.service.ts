import { PrismaService } from "../prisma/prisma.service";
import { HttpException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateUserDto } from "./dto/createUser.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(dto: CreateUserDto) {
    try {
      return await this.prisma.users.create({
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code == "P2002"
      ) {
        throw new HttpException("Credentials is taken", 409);
      } else {
        console.error(error);
        throw new HttpException("Internal server error", 500);
      }
    }
  }

  async findOne(email: string) {
    try {
      return await this.prisma.users.findUnique({ where: { email } });
    } catch (error) {
      console.error(error);
      throw new HttpException("Internal server error", 500);
    }
  }
}
