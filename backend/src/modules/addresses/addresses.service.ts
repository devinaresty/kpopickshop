import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createAddressDto: CreateAddressDto) {
    if (createAddressDto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.create({
      data: {
        ...createAddressDto,
        userId,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.userAddress.findMany({
      where: { userId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: number, userId: number) {
    return this.prisma.userAddress.findFirst({
      where: { id, userId },
    });
  }

  async update(id: number, userId: number, updateAddressDto: UpdateAddressDto) {
    if (updateAddressDto.isDefault) {
      await this.prisma.userAddress.updateMany({
        where: { userId, id: { not: id } },
        data: { isDefault: false },
      });
    }

    return this.prisma.userAddress.update({
      where: { id },
      data: {
        ...updateAddressDto,
      },
    });
  }

  async remove(id: number, userId: number) {
    return this.prisma.userAddress.delete({
      where: { id },
    });
  }

  async getDefault(userId: number) {
    return this.prisma.userAddress.findFirst({
      where: { userId, isDefault: true },
    });
  }
}
