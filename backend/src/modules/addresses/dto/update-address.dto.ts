import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
} from 'class-validator';

export class UpdateAddressDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  detail?: string;

  @IsNumber()
  @IsOptional()
  latitude?: number;

  @IsNumber()
  @IsOptional()
  longitude?: number;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;
}
