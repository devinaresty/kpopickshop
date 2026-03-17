import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";

@ApiTags("Categories")
@Controller("api/categories")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new category (Admin only)" })
  @ApiBody({
    schema: {
      example: {
        name: "K-Drama",
        slug: "k-drama",
        description: "Merchandise dari K-Drama populer",
        image: "https://example.com/category-image.jpg"
      }
    }
  })
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: "Get all categories" })
  async findAll() {
    return this.categoryService.findAll();
  }

  @Get(":id")
  async findById(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.findById(id);
  }

  @Get("slug/:slug")
  async findBySlug(@Param("slug") slug: string) {
    return this.categoryService.findBySlug(slug);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a category (Admin only) - Send all fields" })
  @ApiBody({
    schema: {
      example: {
        name: "K-Drama Popular",
        slug: "k-drama-popular",
        description: "Merchandise dari K-Drama paling populer",
        image: "https://minio.example.com/k-drama-popular.jpg",
        parentId: null
      }
    }
  })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a category (Admin only)" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
}
