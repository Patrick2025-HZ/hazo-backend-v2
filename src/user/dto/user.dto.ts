import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class updateUserDTO {
  @ApiPropertyOptional({ example: 'Danyal Khursheed' })
  @IsOptional()
  @IsString()
  userName?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email' })
  email?: string;

  @ApiPropertyOptional({ example: 'Danyal Khursheed' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiPropertyOptional({ example: '923498030357' })
  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @ApiPropertyOptional({ example: '2024-12-12' })
  @IsOptional()
  @IsString()
  dob?: string;

  // For profile pic later
  // @ApiPropertyOptional({ type: 'string', format: 'binary' })
  // @IsOptional()
  // profile?: any;
}
