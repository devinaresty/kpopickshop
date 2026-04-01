import { Controller, Post, Get, Req, Body, Param, BadRequestException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('api/payments')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create payment invoice for order (User)' })
  @ApiBody({
    schema: {
      example: {
        orderId: 1
      }
    }
  })
  async createPayment(
    @CurrentUser() user: any,
    @Body() body: { orderId: number },
  ) {
    if (!user || !user.id) {
      throw new BadRequestException('User not authenticated');
    }

    const { orderId } = body;
    if (!orderId) {
      throw new BadRequestException('orderId is required');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException(`Order #${orderId} not found`);
    }

    if (order.userId !== user.id) {
      throw new BadRequestException('You can only create payment for your own orders');
    }

    if (order.status !== 'WAITING_PAYMENT') {
      throw new BadRequestException(`Order #${orderId} is already ${order.status}, cannot create new payment`);
    }

    // Determine frontend base URL (support both dev and production)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const successUrl = `${frontendUrl}/payment-success?orderId=${orderId}`;
    const failureUrl = `${frontendUrl}/payment-failed?orderId=${orderId}`;

    const invoice = await this.paymentService.createInvoice(
      orderId,
      order.totalPrice,
      user.email,
      `Payment for Order #${orderId}`,
      successUrl,
      failureUrl,
    );

    return {
      success: true,
      message: 'Payment invoice created successfully',
      orderId,
      invoiceId: invoice.id,
      invoiceUrl: invoice.invoice_url,
      amount: order.totalPrice,
      currency: 'IDR',
    };
  }

  @Get('status/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Check payment status for order from Xendit (User)' })
  async checkPaymentStatus(
    @CurrentUser() user: any,
    @Param('orderId') orderId: string,
  ) {
    if (!user || !user.id) {
      throw new BadRequestException('User not authenticated');
    }

    const order = await this.prisma.order.findUnique({
      where: { id: parseInt(orderId) },
    });

    if (!order) {
      throw new BadRequestException(`Order #${orderId} not found`);
    }

    if (order.userId !== user.id) {
      throw new BadRequestException('You can only check payment status for your own orders');
    }

    const externalId = `order-${orderId}`;
    
    try {
      const invoiceStatus = await this.paymentService.getInvoiceByExternalId(externalId);
      
      if (invoiceStatus && invoiceStatus.status === 'PAID') {
        if (order.status !== 'PAID') {
          await this.prisma.order.update({
            where: { id: parseInt(orderId) },
            data: { status: 'PAID' },
          });
          console.log(`✅ Order #${orderId} status synchronized to PAID from Xendit`);
        }

        return {
          success: true,
          orderId: order.id,
          orderStatus: 'PAID',
          invoiceStatus: invoiceStatus.status,
          amount: invoiceStatus.amount,
          paidAt: invoiceStatus.paid_at,
          message: 'Payment completed! Order status updated.',
          invoiceId: invoiceStatus.id,
        };
      }

      return {
        success: true,
        orderId: order.id,
        orderStatus: order.status,
        invoiceStatus: invoiceStatus?.status || 'PENDING',
        amount: order.totalPrice,
        invoiceId: invoiceStatus?.id,
        message: 'Waiting for payment...',
      };
    } catch (error: any) {
      console.error('Error checking Xendit status:', error);
      return {
        success: false,
        orderId: order.id,
        orderStatus: order.status,
        amount: order.totalPrice,
        message: 'Could not retrieve payment status from Xendit',
        error: error.message,
      };
    }
  }

  @Post('webhook/xendit')
  @ApiOperation({ summary: 'Xendit payment webhook (no auth required)' })
  @ApiBody({
    schema: {
      example: {
        id: 'invoice-id',
        status: 'PAID',
        external_id: 'order-123',
      },
    },
  })
  async handleWebhook(@Body() body: any, @Req() req: Request) {
    console.log('🔍 Webhook received from Xendit');
    console.log('📦 Body:', JSON.stringify(body, null, 2));

    const callbackToken = req.headers['x-callback-token'] as string;
    const expectedToken = process.env.XENDIT_CALLBACK_TOKEN;
    const isLocalhost = req.hostname === 'localhost' || req.hostname === '127.0.0.1';

    if (!callbackToken && !isLocalhost) {
      throw new BadRequestException('Missing X-Callback-Token header');
    }

    if (callbackToken && callbackToken !== expectedToken) {
      throw new BadRequestException('Invalid webhook token');
    }

    console.log('✅ Webhook verified');

    if (body.status !== 'PAID') {
      console.log(`⏭️ Skipping - status is ${body.status}, not PAID`);
      return { success: true, message: 'Event received but not processed' };
    }

    const externalId = body.external_id;
    if (!externalId) {
      throw new BadRequestException('Invalid external_id');
    }

    let orderId: number | null = null;

    if (externalId.startsWith('order-')) {
      orderId = parseInt(externalId.replace('order-', ''), 10);
    } else {
      const match = externalId.match(/\d+/);
      if (match) {
        orderId = parseInt(match[0], 10);
      }
    }

    if (!orderId || isNaN(orderId)) {
      console.warn(`⚠️ Could not extract order ID from external_id: ${externalId}`);
      return { 
        success: true, 
        message: 'Webhook received but no valid order ID',
      };
    }

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      console.warn(`⚠️ Order not found: ${orderId}`);
      return { 
        success: true, 
        message: 'Order not found',
        orderId,
      };
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
      include: {
        items: { include: { product: true } },
      },
    });

    console.log(`✅ Order #${orderId} status updated to PAID`);

    return {
      success: true,
      message: `Order #${orderId} payment received and status updated`,
      order: updatedOrder,
    };
  }
}
