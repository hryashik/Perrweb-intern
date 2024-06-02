import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";

@Injectable()
export class CheckPermissionsGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromParams = +request.params.id;
    if (!userIdFromParams) throw new BadRequestException();

    if (!request.user) throw new UnauthorizedException();

    return request.user.id === userIdFromParams;
  }
}
