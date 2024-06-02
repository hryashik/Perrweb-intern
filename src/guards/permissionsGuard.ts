import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ColumnsService } from "../columns/columns.service";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly columnsService: ColumnsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const paramName =
      this.reflector.get<string>("paramName", context.getHandler()) || "id";

    const request = context.switchToHttp().getRequest();
    const id = +request.params[paramName];

    if (!id) throw new BadRequestException();

    if (!request.user) throw new UnauthorizedException();

    if (paramName === "columnId") {
      const column = await this.columnsService.getColumnById(id);
      const paramUserId = +request.params.userId || request.user.id;
      if (!column || column.user_id !== paramUserId) return false;
      return true;
    }
    return request.user.id === id;
  }
}
