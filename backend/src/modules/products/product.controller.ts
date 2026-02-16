import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";

@ApiTags("Products")
@Controller("api/products")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new product" })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all products" })
  @ApiQuery({
    name: "skip",
    required: false,
    type: Number,
    description: "Number of items to skip",
  })
  @ApiQuery({
    name: "take",
    required: false,
    type: Number,
    description: "Number of items to take",
  })
  async findAll(
    @Query("skip") skip: number = 0,
    @Query("take") take: number = 10,
  ) {
    return this.productService.findAll(skip, take);
  }

  @Get("promoted")
  async findPromoted(
    @Query("skip") skip: number = 0,
    @Query("take") take: number = 10,
  ) {
    return this.productService.findPromoted(skip, take);
  }

  @Get("category/:categoryId")
  async findByCategory(
    @Param("categoryId", ParseIntPipe) categoryId: number,
    @Query("skip") skip: number = 0,
    @Query("take") take: number = 10,
  ) {
    return this.productService.findByCategory(categoryId, skip, take);
  }

  @Get(":id")
  async findById(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findById(id);
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string) {
    return this.productService.findBySlug(slug);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }
}
