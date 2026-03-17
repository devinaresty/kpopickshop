import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { PaymentService } from '../payment/payment.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService,
  ) {}

  async create(userId: number, dto: CreateOrderDto) {
    const { items, ...shippingData } = dto;

    let totalItemPrice = 0;
    const orderItemsData: Array<{
      productId: number;
      quantity: number;
      price: number;
    }> = [];

    for (const item of items) {
      const product = await this.prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new NotFoundException(`Product ID ${item.productId} not found`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Stock for ${product.name} is insufficient`);
      }

      totalItemPrice += product.price * item.quantity;

      orderItemsData.push({
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const shippingFee = 15000;
    const totalPrice = totalItemPrice + shippingFee;

    const newOrder = await this.prisma.$transaction(async (tx) => {
      for (const item of orderItemsData) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      const order = await tx.order.create({
        data: {
          userId,
          totalPrice,
          status: 'WAITING_PAYMENT',
          metadata: JSON.stringify({
            totalItemPrice,
            shippingFee,
            recipientName: shippingData.recipientName,
            recipientPhone: shippingData.recipientPhone,
            shippingAddress: shippingData.shippingAddress,
            shippingDetail: shippingData.shippingDetail,
            courierNote: shippingData.courierNote,
            shippingLat: shippingData.shippingLat,
            shippingLong: shippingData.shippingLong,
          }),
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      return order;
    });

    try {
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });

      if (user) {
        const invoice = await this.paymentService.createInvoice(
          newOrder.id,
          totalPrice,
          user.email,
        );

        const metadata = JSON.parse(newOrder.metadata || '{}');
        metadata.xenditInvoiceId = invoice.id;
        metadata.paymentUrl = invoice.invoice_url;

        return await this.prisma.order.update({
          where: { id: newOrder.id },
          data: {
            metadata: JSON.stringify(metadata),
          },
          include: {
            items: { include: { product: true } },
          },
        });
      }
    } catch (error) {
      console.error('Error creating Xendit invoice:', error);
    }

    return newOrder;
  }

  async findAllByUser(userId: number) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { name: true, email: true } },
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: number, status: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: { include: { product: true } },
      },
    });
  }
}
