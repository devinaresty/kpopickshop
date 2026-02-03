import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

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

  // Proxy methods to PrismaClient
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

  async disconnect() {
    if (prismaInstance) {
      await prismaInstance.$disconnect();
      prismaInstance = null;
    }
  }
}


