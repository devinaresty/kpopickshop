import { IsString, IsIn } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(Object.values(OrderStatus))
  status: OrderStatus;
}
