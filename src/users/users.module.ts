import { Global, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.contoller";


@Global()
@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
