import { Injectable, BadRequestException, UnauthorizedException,} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { PrismaService } from "../../prisma/prisma.service";
import { StorageService } from "../../common/services/storage.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { UserResponseDto } from "./dto/user.response.dto";
import { AuthResponseDto } from "./dto/auth.response.dto";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
    private storageService: StorageService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        phone: registerDto.phone,
        address: registerDto.address,
        role: "USER",
      },
    });

    const userResponse = this.mapUserToResponse(user);
    const access_token = this.generateAccessToken(user);

    return {
      access_token,
      user: userResponse,
    };
  }

  async registerAdmin(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        phone: registerDto.phone,
        address: registerDto.address,
        role: "ADMIN",
      },
    });

    const userResponse = this.mapUserToResponse(user);
    const access_token = this.generateAccessToken(user);

    return {
      access_token,
      user: userResponse,
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const userResponse = this.mapUserToResponse(user);
    const access_token = this.generateAccessToken(user);

    return {
      access_token,
      user: userResponse,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return this.mapUserToResponse(user);
  }

  async getAllUsers(): Promise<UserResponseDto[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return users.map((user) => this.mapUserToResponse(user));
  }

  async uploadProfilePhoto(userId: number, fileBuffer: Buffer, mimeType: string, fileName: string): Promise<UserResponseDto> {
    try {
      const timestamp = Date.now();
      const uniqueFileName = `${timestamp}-${fileName}`;
      
      const uploadResult = await this.storageService.uploadFileWithFolder(
        uniqueFileName,
        fileBuffer,
        mimeType,
        'profiles'
      );
      
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { photoUrl: uploadResult.fileUrl }
      });

      return this.mapUserToResponse(user);
    } catch (error: any) {
      console.error('❌ Profile photo upload error:', error?.message || error);
      throw new BadRequestException(`Failed to upload profile photo: ${error?.message || 'Unknown error'}`);
    }
  }

  async deleteProfilePhoto(userId: number): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id: userId },
        data: { photoUrl: null }
      });

      return this.mapUserToResponse(user);
    } catch (error: any) {

      throw new BadRequestException(`Failed to delete profile photo: ${error?.message || 'Unknown error'}`);
    }
  }

  private generateAccessToken(user: any): string {
    const payload = { email: user.email, sub: user.id, role: user.role };
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "MISSING_JWT_SECRET_IN_ENV",
      expiresIn: "24h",
    });
  }

  private mapUserToResponse(user: any): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address,
      photoUrl: user.photoUrl || null, 
      createdAt: new Date(user.createdAt).toISOString(),
      updatedAt: new Date(user.updatedAt).toISOString(),
    };
  }
}
