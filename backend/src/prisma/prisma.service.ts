import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient | null = null;

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private prisma: PrismaClient;

  constructor() {
    super();
    if (!prismaInstance) {
      prismaInstance = new PrismaClient();
    }
    this.prisma = prismaInstance;
  }

  get user() {
    return this.prisma.user;
  }

  get category() {
    return this.prisma.category;
  }

  get product() {
    return this.prisma.product;
  }

  get order() {
    return this.prisma.order;
  }

  get orderItem() {
    return this.prisma.orderItem;
  }

  get userAddress() {
    return this.prisma.userAddress;
  }

  get cart() {
    return this.prisma.cart;
  }

  get cartItem() {
    return this.prisma.cartItem;
  }

  async disconnect() {
    if (prismaInstance) {
      await prismaInstance.$disconnect();
      prismaInstance = null;
    }
  }

  async onModuleInit() {
    await this.prisma.$connect();
  }

  async onModuleDestroy() {
    await this.disconnect();
  }
}
