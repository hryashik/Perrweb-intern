import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
//import { ColumnsService } from "../columns/columns.service";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const paramName =
      this.reflector.get<string>("paramName", context.getHandler()) || "id";

    const request = context.switchToHttp().getRequest();
    const id = +request.params[paramName];

    if (!id) throw new BadRequestException();

    if (!request.user) throw new UnauthorizedException();

    if (paramName === "columnId") {
      const column = await this.prisma.columns.findUnique({ where: { id } });
      const paramUserId = +request.params.userId || request.user.id;
      if (!column || column.user_id !== paramUserId) return false;
      return true;
    } else if (paramName === "cardId") {
      const card = await this.prisma.cards.findUnique({
        where: { id },
        include: { columns: { include: { users: true } } },
      });
      if (!card) throw new NotFoundException();

      return card.columns.user_id === request.user.id;
    } else if (paramName === "commentId") {
      const comment = await this.prisma.comments.findUnique({
        where: { id },
        include: {
          cards: { include: { columns: { include: { users: true } } } },
        },
      });
      if (!comment) throw new NotFoundException();

      return comment.cards.columns.user_id === request.user.id;
    }
    return request.user.id === id;
  }
}
