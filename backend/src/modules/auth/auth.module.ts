import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { JwtStrategy } from "../../common/strategies/jwt.strategy";
import { LocalStrategy } from "../../common/strategies/local.strategy";
import { PrismaModule } from "../../prisma/prisma.module";
import { StorageModule } from "../../common/services/storage.module";

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    StorageModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || "MISSING_JWT_SECRET_IN_ENV",
      signOptions: { expiresIn: "24h" },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
