export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
