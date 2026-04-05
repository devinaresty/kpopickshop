import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('api/addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  async create(@Request() req, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(req.user.id, createAddressDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.addressesService.findAll(req.user.id);
  }

  @Get('default')
  async getDefault(@Request() req) {
    return this.addressesService.getDefault(req.user.id);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const address = await this.addressesService.findOne(+id, req.user.id);
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    return address;
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    return this.addressesService.update(+id, req.user.id, updateAddressDto);
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    const address = await this.addressesService.findOne(+id, req.user.id);
    if (!address) {
      throw new BadRequestException('Address not found');
    }
    return this.addressesService.remove(+id, req.user.id);
  }
}
