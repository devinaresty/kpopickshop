import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Check if slug already exists
    const existingProduct = await this.prisma.product.findUnique({
      where: { slug: createProductDto.slug },
    });

    if (existingProduct) {
      throw new BadRequestException("Slug already exists");
    }

    // Check if category exists
    const category = await this.prisma.category.findUnique({
      where: { id: createProductDto.categoryId },
    });

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return this.prisma.product.create({
      data: createProductDto,
      include: { category: true },
    });
  }

  async findAll(skip: number = 0, take: number = 10) {
    const products = await this.prisma.product.findMany({
      skip,
      take,
      include: { category: true },
    });

    const total = await this.prisma.product.count();

    return {
      data: products,
      total,
      skip,
      take,
    };
  }

  async findById(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return product;
  }

  async findByCategory(
    categoryId: number,
    skip: number = 0,
    take: number = 10,
  ) {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
      skip,
      take,
      include: { category: true },
    });

    const total = await this.prisma.product.count({
      where: { categoryId },
    });

    return {
      data: products,
      total,
      skip,
      take,
    };
  }

  async findPromoted(skip: number = 0, take: number = 10) {
    const products = await this.prisma.product.findMany({
      where: { isPromoted: true },
      skip,
      take,
      include: { category: true },
    });

    const total = await this.prisma.product.count({
      where: { isPromoted: true },
    });

    return {
      data: products,
      total,
      skip,
      take,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    // Check if new slug already exists
    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { slug: updateProductDto.slug },
      });

      if (existingProduct) {
        throw new BadRequestException("Slug already exists");
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: { category: true },
    });
  }

  async remove(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException("Product not found");
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }
}
