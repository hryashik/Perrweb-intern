import { Module, ValidationPipe } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaService } from "./prisma/prisma.service";
import { PrismaModule } from "./prisma/prisma.module";
import { APP_PIPE } from "@nestjs/core";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
