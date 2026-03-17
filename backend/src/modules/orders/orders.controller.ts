import { Controller, Get, Post, Body, UseGuards, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '@prisma/client';

@ApiTags('Orders')
@Controller('api/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('user', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new order (checkout)' })
  @ApiBody({
    schema: {
      example: {
        items: [
          {
            productId: 1,
            quantity: 2
          },
          {
            productId: 3,
            quantity: 1
          }
        ],
        recipientName: "John Doe",
        recipientPhone: "08123456789",
        shippingAddress: "Jl. K-pop No. 123",
        shippingDetail: "Apt 5A",
        courierNote: "Fragile package",
        shippingLat: -6.195,
        shippingLong: 106.816
      }
    }
  })
  create(@CurrentUser() user: User, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(user.id, createOrderDto);
  }

  @Get()
  @Roles('user', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user orders' })
  findAll(@CurrentUser() user: User) {
    return this.ordersService.findAllByUser(user.id);
  }

  @Get('admin/all')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders (Admin only)' })
  findAllAdmin(@CurrentUser() user: User) {
    return this.ordersService.findAll();
  }

  @Put(':id/status')
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update order status (Admin only) - Send new status' })
  @ApiBody({
    schema: {
      example: {
        status: "PAID"
      },
      description: "Valid statuses: WAITING_PAYMENT, PAID, PROCESSING, SHIPPED, COMPLETED, CANCELLED"
    }
  })
  updateStatus(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, dto.status);
  }
}
