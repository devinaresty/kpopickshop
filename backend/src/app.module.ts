import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./modules/auth/auth.module";
import { ProductModule } from "./modules/products/product.module";
import { CategoryModule } from "./modules/categories/category.module";
import { PrismaModule } from "./prisma/prisma.module";
import { PaymentModule } from "./modules/payment/payment.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { AddressesModule } from "./modules/addresses/addresses.module";
import { ImageUrlInterceptor } from "./interceptors/image-url.interceptor";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    AuthModule,
    ProductModule,
    CategoryModule,
    PaymentModule,
    OrdersModule,
    AddressesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ImageUrlInterceptor,
    },
  ],
})
export class AppModule {}
