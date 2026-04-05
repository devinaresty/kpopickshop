import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

let prismaInstance: PrismaClient | null = null;

@Injectable()
export class PrismaService {
  private prisma: PrismaClient;

  constructor() {
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

  $transaction(callback: (tx: PrismaClient) => Promise<any>) {
    return this.prisma.$transaction(callback);
  }

  async disconnect() {
    if (prismaInstance) {
      await prismaInstance.$disconnect();
      prismaInstance = null;
    }
  }
}
