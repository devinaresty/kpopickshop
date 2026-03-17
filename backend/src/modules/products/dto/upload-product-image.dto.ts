import { IsString, IsOptional } from 'class-validator';

export class UploadProductImageDto {
  @IsString()
  @IsOptional()
  description?: string;
}
