import { IsOptional, IsString, IsEnum } from 'class-validator';
import { UserRole } from '../users.schema';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
