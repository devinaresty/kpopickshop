import { Controller, Get, Post, Patch, Body, useGuards, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@useGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) {}

    @Get()
    getCart(@CurrentUser() user: any) {
        return this.cartService.getCart(user.id);
    }

    @Post()
    addToCart(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
        return this.cartService.addToCart(user.id, dto);
    }

    @Patch('items/:id')
    updateQuantity(@CurrentUser() user: any, @Param('id', ParseIntPipe) cartitemId: number, @Body('quantity') quantity: number) {
        return this.cartService.updateItemQuantity(user.id, cartitemId, quantity);
    }

    @Delete('items/:id')
    removeItem(
        @CurrentUser() user: any,
        @Param('id', ParseIntPipe) cartitemId: number
    ) {
        return this.cartService.removeItem(user.id, cartitemId);
    }
}
