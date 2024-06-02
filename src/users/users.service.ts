import { PrismaService } from "../prisma/prisma.service";
import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  forwardRef,
} from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { AuthService } from "../auth/auth.service";
@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

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

  async findOneByEmail(email: string) {
    try {
      return await this.prisma.users.findUnique({ where: { email } });
    } catch (error) {
      console.error(error);
      throw new HttpException("Internal server error", 500);
    }
  }

  async findOneById(id: number) {
    try {
      return await this.prisma.users.findUnique({ where: { id } });
    } catch (error) {
      console.error(error);
      throw new HttpException("Internal server error", 500);
    }
  }

  async updateUser(dto: UpdateUserDto, userId: number) {
    try {
      const hash = dto.password
        ? await this.authService.createHash(dto.password)
        : undefined;
      const user = await this.prisma.users.update({
        where: { id: userId },
        data: { email: dto.email, username: dto.username, hash },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new HttpException("Credentials is taken", 409);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
