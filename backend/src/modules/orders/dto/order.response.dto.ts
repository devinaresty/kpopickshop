import { OrderStatus } from '@prisma/client';

export class OrderResponseDto {
  id: number;
  userId: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    name: string;
    email: string;
  };
  items?: Array<{
    id: number;
    orderId: number;
    productId: number;
    quantity: number;
    price: number;
    product?: {
      id: number;
      name: string;
      imageUrl?: string;
    };
  }>;
}
