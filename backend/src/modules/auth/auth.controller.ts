import { Body, Controller, Get, HttpCode, Post, Delete, UseGuards, Request, BadRequestException, UseInterceptors, UploadedFile } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiOperation, ApiTags, ApiResponse, ApiBearerAuth, ApiBody, ApiConsumes} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { AuthResponseDto } from "./dto/auth.response.dto";
import { UserResponseDto } from "./dto/user.response.dto";
import { JwtAuthGuard } from "../../common/guards/jwt-auth.guard";
import { RolesGuard } from "../../common/guards/roles.guard";
import { Roles } from "../../common/decorators/roles.decorator";
import { CurrentUser } from "../../common/decorators/current-user.decorator";
import { ImageUrlInterceptor } from "../../interceptors/image-url.interceptor";

@ApiTags("Auth")
@Controller("api/auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  @HttpCode(201)
  @ApiOperation({ summary: "Register a new user" })
  @ApiBody({
    schema: {
      example: {
        email: "user@example.com",
        name: "John Doe",
        password: "password123",
        phone: "08123456789",
        address: "Jl. K-pop No. 123"
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: "User registered successfully",
    type: AuthResponseDto,
  })
  async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post("admin/register")
  @HttpCode(201)
  @ApiOperation({ summary: "Register a new admin user" })
  @ApiBody({
    schema: {
      example: {
        email: "admin@example.com",
        name: "Admin User",
        password: "password123",
        phone: "08123456789",
        address: "Jl. K-pop No. 123"
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: "Admin user registered successfully",
    type: AuthResponseDto,
  })
  async registerAdmin(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.registerAdmin(registerDto);
  }

  @Post("login")
  @HttpCode(200)
  @ApiOperation({ summary: "Login user" })
  @ApiBody({
    schema: {
      example: {
        email: "user@example.com",
        password: "password123"
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: "Login successful",
    type: AuthResponseDto,
  })
  async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(loginDto);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ImageUrlInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user profile" })
  @ApiResponse({
    status: 200,
    description: "Current user data",
    type: UserResponseDto,
  })
  async getCurrentUser(@CurrentUser() user: any): Promise<UserResponseDto> {
    if (!user) {
      throw new BadRequestException("User not found in token");
    }
    return this.authService.getUserById(user.id);
  }

  @Get("users")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("admin")
  @UseInterceptors(ImageUrlInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get all users (Admin only)" })
  @ApiResponse({
    status: 200,
    description: "List of all users",
    type: [UserResponseDto],
  })
  async getAllUsers(): Promise<UserResponseDto[]> {
    return this.authService.getAllUsers();
  }

  @Post("upload-profile-photo")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("file"), ImageUrlInterceptor)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: "Upload user profile photo" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        file: {
          type: "string",
          format: "binary",
          description: "Profile photo file (max 10MB, jpg/png/webp)",
        },
      },
      required: ["file"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "Profile photo uploaded successfully",
    type: UserResponseDto,
  })
  async uploadProfilePhoto(
    @CurrentUser() user: any,
    @UploadedFile() file: any,
  ): Promise<UserResponseDto> {
    if (!user) {
      throw new BadRequestException("User not found in token");
    }

    if (!file) {
      throw new BadRequestException("File is required");
    }

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException("File size exceeds 10MB limit");
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedMimes.includes(file.mimetype)) {
      throw new BadRequestException("Only JPG, PNG, and WebP images are allowed");
    }

    return this.authService.uploadProfilePhoto(
      user.id,
      file.buffer,
      file.mimetype,
      file.originalname,
    );
  }

  @Delete("delete-profile-photo")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ImageUrlInterceptor)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete user profile photo" })
  @ApiResponse({
    status: 200,
    description: "Profile photo deleted successfully",
    type: UserResponseDto,
  })
  async deleteProfilePhoto(
    @CurrentUser() user: any,
  ): Promise<UserResponseDto> {
    if (!user) {
      throw new BadRequestException("User not found in token");
    }

    return this.authService.deleteProfilePhoto(user.id);
  }
}
