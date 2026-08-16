import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) {}

    async getCart(userId: number) {
        let cart = await this.prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: { product: true },
                },
            },
        });

        if (!cart) {
            cart = await this.prisma.cart.create({
                data: { userId },
                include: { items: { include: { product: true } } },
            });
        }
        return cart;
    }

    async addToCart(userId: number, dto: AddToCartDto) {
        const product = await this.prisma.product.findUnique({
            where: { id: dto.productId },
        });
        if (!product) throw new NotFoundException('Product not found');

        let cart = await this.prisma.cart.findUnique({ where: { userId } });
        if (!cart) {
            cart = await this.prisma.cart.create({ data: { userId } });
        }

        const existingCartItem = await this.prisma.cartItem.findUnique({
            where: {
                cartId_productId: {
                    cartId: cart.id,
                    productId: dto.productId,
                },
            },
        });

        if (existingCartItem) {
            return this.prisma.cartItem.update({
                where: { id: existingCartItem.id },
                data: { quantity: existingCartItem.quantity + dto.quantity },
            });
        } else {
            return this.prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId: dto.productId,
                    quantity: dto.quantity,
                },
            });
        }
    }

    async updateItemQuantity(userId: number, cartItemId: number, quantity: number) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true },
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            throw new NotFoundException('Item Not Found');
    }

        if (quantity <= 0) {
            return this.removeItem(userId, cartItemId);
    }

        return this.prisma.cartItem.update({
            where: { id: cartItemId },
            data: { quantity },
    });
    }

    async removeItem(userId: number, cartItemId: number) {
        const cartItem = await this.prisma.cartItem.findUnique({
            where: { id: cartItemId },
            include: { cart: true },
        });

        if (!cartItem || cartItem.cart.userId !== userId) {
            throw new NotFoundException('Item Not Found');
        }

        return this.prisma.cartItem.delete({
            where: { id: cartItemId },
        });
    }
}


