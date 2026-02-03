export class UserResponseDto {
  id: number;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
