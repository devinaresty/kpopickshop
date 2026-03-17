import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { PrismaModule } from "../../prisma/prisma.module";
import { StorageService } from "../../common/services/storage.service";

@Module({
  imports: [PrismaModule],
  controllers: [ProductController],
  providers: [ProductService, StorageService],
  exports: [ProductService],
})
export class ProductModule {}
