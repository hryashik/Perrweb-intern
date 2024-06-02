import { Global, Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.contoller";
import { ColumnsModule } from "../columns/columns.module";

@Global()
@Module({
  imports: [ColumnsModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
