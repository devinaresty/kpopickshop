import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
    @IsNumber()
    @IsNotEmpty()
    productId: number;

    @IsNumber()
    @IsNotEmpty()
    quantity: number;
}

export class CreateOrderDto {
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OrderItemDto)
    items: OrderItemDto[];

    @IsString()
    @IsNotEmpty()
    recipientName: string;

    @IsString()
    @IsNotEmpty()
    recipientPhone: string;

    @IsString()
    @IsNotEmpty()
    shippingAddress: string;

    @IsString()
    @IsOptional()
    shippingCity?: string;

    @IsString()
    @IsOptional()
    shippingProvince?: string;

    @IsString()
    @IsOptional()
    shippingPostalCode?: string;

    @IsString()
    @IsOptional()
    shippingDetail?: string;

    @IsString()
    @IsOptional()
    courierNote?: string;

    @IsNumber()
    @IsOptional()
    shippingLat?: number;

    @IsNumber()
    @IsOptional()
    shippingLong?: number;
}
