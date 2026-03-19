import { Controller,  Get,  Post,  Body,   Put, Param, Delete, Query, UseGuards, ParseIntPipe, UseInterceptors, UploadedFile, BadRequestException, } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth, ApiQuery, ApiBody, ApiConsumes,} from "@nestjs/swagger";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { UploadProductImageDto } from "./dto/upload-product-image.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { StorageService } from "../../common/services/storage.service";

@ApiTags("Products")
@Controller("api/products")
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly storageService: StorageService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new product (Admin only)" })
  @ApiBody({
    schema: {
      example: {
        name: "BTS Lightstick Ver. 4",
        slug: "bts-lightstick-ver-4",
        description: "Official BTS Lightstick versi ke 4 dengan fitur interaktif",
        price: 350000,
        stock: 50,
        categoryId: 2,
        image: "lightstick-bts-v4.jpg",
        imageUrl: "https://minio.example.com/products/lightstick-bts-v4.jpg",
        isPromoted: true
      }
    }
  })
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

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a product (Admin only) - Send all fields" })
  @ApiBody({
    schema: {
      example: {
        name: "AESPA OFFICIAL MD [RANDOM CHARACTER FIGURE]",
        slug: "aespa-official-md-random",
        description: "Official AESPA merchandise random character figure",
        price: 339430,
        stock: 0,
        categoryId: 2,
        image: "aespa-md.jpg",
        imageUrl: "https://minio.example.com/aespa-md.jpg",
        isPromoted: false
      }
    }
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a product (Admin only)" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  @Post("upload")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @UseInterceptors(FileInterceptor("file"))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "Upload product image to Minio (Admin only)" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Product image file",
        },
        description: {
          type: "string",
          description: "Optional image description",
        },
      },
      required: ["file"],
    },
  })
  async uploadProductImage(
    @UploadedFile() file: any,
    @Body() body: any,
  ) {
    if (!file) {
      throw new BadRequestException("No file provided");
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed: ${allowedMimes.join(", ")}`,
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException(
        `File size exceeds maximum limit of 5MB. Got ${(file.size / 1024 / 1024).toFixed(2)}MB`,
      );
    }

    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(7);
    const extension = file.originalname.split(".").pop();
    const fileName = `${timestamp}-${randomStr}.${extension}`;

    return await this.storageService.uploadFile(fileName, file.buffer, file.mimetype);
  }
}
